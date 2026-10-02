/* =========================================================
 * simulation.js — 欧冠比赛模拟引擎
 *
 * 模型思路：
 *   1. 每队进球数由「泊松分布」抽样，期望进球 λ 由双方实力差
 *      （含主场优势）决定，红牌会动态修正 λ；
 *   2. 依次生成：红牌意向 → 各事件数量与时间 → 黄牌/红牌球员
 *      → 换人 → 按「事件发生时是否在场」校验并分配所有球员；
 *   3. 在场约束：进球者、助攻者、吃牌者、被换下者、VAR 取消
 *      进球的球员等，都必须在该事件发生时正在场上——
 *      替补登场后才能进球，被换下/罚下后不再产生事件；
 *   4. 进球者按位置加权（前锋 > 中场 > 后卫），并结合球员
 *      能力分（球队实力 + 姓名哈希抖动，保证稳定）；
 *   5. 输出完整时间线事件 + 技术统计 + 全场最佳。
 *
 * 所有随机数由可复现的种子（mulberry32）驱动，
 * 「重新模拟」即换一个种子再跑一遍。
 * ========================================================= */

(function (global) {
  'use strict';

  /* ---------------- 基础工具 ---------------- */

  /** mulberry32 伪随机数发生器：同一 seed 得到同一序列 */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** FNV-1a 字符串哈希（用于球员能力抖动） */
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  /** 球员能力分：球队实力 + 稳定抖动，前锋/门将微调 */
  function playerRating(player, teamStrength) {
    const jitter = (hashStr(player.name) % 9) - 4; // -4 ~ +4
    let r = teamStrength + jitter;
    if (player.pos === 'FW') r += 2;
    if (player.pos === 'GK') r += 1;
    return Math.max(45, Math.min(99, r));
  }

  /** 泊松抽样（Knuth 算法） */
  function poisson(lambda, rng) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= rng();
    } while (p > L);
    return k - 1;
  }

  /** 按权重随机挑一个元素 */
  function pickWeighted(items, weightFn, rng) {
    const weights = items.map(weightFn);
    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) return items[0];
    let r = rng() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  function randInt(rng, min, max) {
    return min + Math.floor(rng() * (max - min + 1));
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  /* ---------------- 位置权重 ---------------- */

  const POS_WEIGHT_GOAL = { FW: 60, MF: 30, DF: 10, GK: 0.5 };
  const POS_WEIGHT_ASSIST = { FW: 30, MF: 45, DF: 25, GK: 0.5 };
  const POS_WEIGHT_PENALTY = { FW: 70, MF: 22, DF: 8, GK: 0 };
  const POS_WEIGHT_OWNGOL = { FW: 12, MF: 22, DF: 58, GK: 8 };
  const POS_WEIGHT_YELLOW = { FW: 14, MF: 38, DF: 42, GK: 6 };

  /* ---------------- 事件构建 ---------------- */

  function ev(minute, stoppage, side, type, title, text, subtext, score, meta) {
    return { minute, stoppage, side, type, title, text, subtext, score, meta: meta || null };
  }

  /** 事件排序键：先分钟、再补时、再按生成顺序（稳定排序）
   *  半场哨使用特殊键 4550：位于 45'+X 事件之后、46' 之前 */
  function sortEvents(events) {
    const keyOf = (e) => e.type === 'halftime' ? 4550 : e.minute * 100 + e.stoppage;
    return events
      .map((e, i) => ({ e, i }))
      .sort((a, b) => {
        const ka = keyOf(a.e);
        const kb = keyOf(b.e);
        return ka !== kb ? ka - kb : a.i - b.i;
      })
      .map((x) => x.e);
  }

  /* ---------------- 主流程 ---------------- */

  /**
   * 模拟一场比赛
   * @param {object} home 主队（teams.js 中的对象）
   * @param {object} away 客队
   * @param {number} seed 随机种子（不传则随机）
   */
  function simulateMatch(home, away, seed) {
    seed = seed === undefined ? Math.floor(Math.random() * 1e9) : seed;
    const rng = mulberry32(seed);

    const events = [];
    const yellows = { home: [], away: [] };   // {player, minute}
    const redPlayerEvents = [];               // {team, player, minute, kind, text}
    const subEvents = [];                     // {team, minute, out, in}
    const subbedOut = { home: new Set(), away: new Set() };
    const benchUsed = { home: new Set(), away: new Set() };

    /* ---- 1. 期望进球 λ ---- */
    const HOME_ADV = 3;
    const ratio = (home.strength + HOME_ADV) / away.strength;
    let lambdaHome = clamp(1.42 * Math.pow(ratio, 1.5), 0.25, 4.8);
    let lambdaAway = clamp(1.42 / Math.pow(ratio, 1.5), 0.25, 4.8);

    /* ---- 2. 红牌意向（先抽，用于修正 λ） ---- */
    const redRolls = [];
    function rollRedCard() {
      if (rng() > 0.15) return null;
      const weakTeam = lambdaHome >= lambdaAway ? 1 : 0;
      const teamIdx = rng() < 0.58 ? weakTeam : 1 - weakTeam;
      const type = rng() < 0.55 ? 'second' : 'straight';
      const minute = type === 'second' ? randInt(rng, 58, 87) : randInt(rng, 22, 84);
      return { team: teamIdx, type, minute };
    }
    let red = rollRedCard();
    while (red) {
      const frac = (90 - red.minute) / 90; // 红牌后剩余时间占比
      if (red.team === 0) { lambdaHome *= 1 - 0.3 * frac; lambdaAway *= 1 + 0.3 * frac; }
      else { lambdaAway *= 1 - 0.3 * frac; lambdaHome *= 1 + 0.3 * frac; }
      redRolls.push(red);
      red = rng() < 0.06 ? rollRedCard() : null; // 极少数情况双红
    }

    /* ---- 3. 事件数量与时间（先定时间，球员随后按「是否在场」分配） ---- */
    const nHome = poisson(lambdaHome, rng);
    const nAway = poisson(lambdaAway, rng);
    const ndis = rng() < 0.42 ? (rng() < 0.72 ? 1 : 2) : 0;
    const nYellows = poisson(3.6, rng);
    const stoppage = clamp(2 + poisson(1.6, rng) + (nHome + nAway + ndis + nYellows > 15 ? 1 : 0), 2, 7);

    function goalEventTime() {
      let m = 2 + Math.floor(Math.pow(rng(), 0.9) * 87);
      if (rng() < 0.08) m = 90 + randInt(rng, 1, stoppage); // 补时绝杀/绝平
      return { minute: Math.min(m, 90), stoppage: m > 90 ? m - 90 : 0 };
    }
    const effMin = (t) => t.minute + t.stoppage; // 有效时间（补时折算）

    const goalEvents = [];
    for (let i = 0; i < nHome; i++) {
      const roll = rng();
      const type = roll < 0.09 ? 'penalty' : roll < 0.135 ? 'owngoal' : 'goal';
      goalEvents.push({ team: 0, time: goalEventTime(), type, scorer: null, scorerTeam: null, assist: null });
    }
    for (let i = 0; i < nAway; i++) {
      const roll = rng();
      const type = roll < 0.09 ? 'penalty' : roll < 0.135 ? 'owngoal' : 'goal';
      goalEvents.push({ team: 1, time: goalEventTime(), type, scorer: null, scorerTeam: null, assist: null });
    }

    const disallowedEvents = [];
    const disallowedReasons = [
      { text: '越位在先', w: 52 },
      { text: '手球在先', w: 22 },
      { text: '进攻球员犯规在先', w: 16 },
      { text: '皮球先出底线', w: 10 }
    ];
    for (let i = 0; i < ndis; i++) {
      disallowedEvents.push({
        team: rng() < 0.5 ? 0 : 1,
        time: goalEventTime(),
        reason: pickWeighted(disallowedReasons, (x) => x.w, rng).text,
        scorer: null
      });
    }

    /* ---- 4. 黄牌（暂分配给首发且不重复的球员，随后校验在场状态） ---- */
    for (let i = 0; i < nYellows; i++) {
      const teamIdx = rng() < 0.5 ? 0 : 1;
      const team = teamIdx === 0 ? home : away;
      const sideKey = teamIdx === 0 ? 'home' : 'away';
      const booked = yellows[sideKey].map((y) => y.player);
      const pool = team.players.slice(0, 11).filter((p) => !booked.includes(p));
      if (pool.length === 0) continue;
      const player = pickWeighted(pool, (p) => POS_WEIGHT_YELLOW[p.pos] || 0, rng);
      yellows[sideKey].push({ player, minute: randInt(rng, 8, 88) });
    }

    /* ---- 5. 红牌球员（两黄变一红需已有黄牌在先） ---- */
    redRolls.forEach((r) => {
      const sideKey = r.team === 0 ? 'home' : 'away';
      const team = r.team === 0 ? home : away;
      if (r.type === 'second') {
        const candidates = yellows[sideKey].filter((y) => y.minute < r.minute - 3);
        if (candidates.length > 0) {
          const chosen = candidates[randInt(rng, 0, candidates.length - 1)];
          // 红牌必须晚于第一张黄牌，且不晚于 90 分钟
          r.minute = clamp(Math.max(chosen.minute + 12, r.minute), chosen.minute + 1, 90);
          redPlayerEvents.push({
            team: r.team, player: chosen.player, minute: r.minute,
            kind: 'second', text: '两黄变一红被罚下'
          });
          return;
        }
        // 没有可用的已吃牌球员 → 降级为直接红牌
      }
      const reasons = ['恶意犯规踩踏对手', '阻止明显得分机会', '暴力行为'];
      const booked = yellows[sideKey].map((y) => y.player);
      const pool = team.players.slice(0, 11).filter((p) => !booked.includes(p));
      const safePool = pool.length > 0 ? pool : team.players.slice(0, 11);
      const player = pickWeighted(safePool, (p) => POS_WEIGHT_YELLOW[p.pos] || 0, rng);
      redPlayerEvents.push({
        team: r.team, player, minute: r.minute,
        kind: 'straight', text: '直接红牌！' + reasons[randInt(rng, 0, reasons.length - 1)]
      });
    });

    /* ---- 6. 换人（出场者须为在场首发；红牌球员不可参与换人） ---- */
    [0, 1].forEach((teamIdx) => {
      const team = teamIdx === 0 ? home : away;
      const sideKey = teamIdx === 0 ? 'home' : 'away';
      const redCount = redPlayerEvents.filter((r) => r.team === teamIdx).length;
      const redPlayers = redPlayerEvents.filter((r) => r.team === teamIdx).map((r) => r.player);
      const nSubs = clamp(3 + poisson(1.1, rng) + redCount, 3, 5);
      let minute = randInt(rng, 46, 62);
      for (let i = 0; i < nSubs; i++) {
        const outPool = team.players.slice(0, 11).filter(
          (p) => !subbedOut[sideKey].has(p) && !redPlayers.includes(p)
        );
        const inPool = team.players.slice(11).filter((p) => !benchUsed[sideKey].has(p));
        if (outPool.length === 0 || inPool.length === 0) break;
        // 有黄牌在身的主力更可能被换下
        const booked = yellows[sideKey].map((y) => y.player);
        const out = pickWeighted(outPool, (p) => (booked.includes(p) ? 3 : 1), rng);
        // 门将只与门将互换，避免出现门将替换中场的荒谬换人
        const candidates = inPool.filter((p) =>
          out.pos === 'GK' ? p.pos === 'GK' : p.pos !== 'GK'
        );
        if (candidates.length === 0) break;
        const inn = candidates[randInt(rng, 0, candidates.length - 1)];
        subbedOut[sideKey].add(out);
        benchUsed[sideKey].add(inn);
        subEvents.push({ team: teamIdx, minute, out, in: inn });
        minute = Math.min(minute + randInt(rng, 7, 18), 88);
        if (minute >= 88) break;
      }
    });

    /* ---- 7. 在场名单：事件发生时正在场上的球员 ---- */
    function onPitchPlayers(teamIdx, timeMinute) {
      const team = teamIdx === 0 ? home : away;
      const sideKey = teamIdx === 0 ? 'home' : 'away';
      const redEvents = redPlayerEvents.filter((r) => r.team === teamIdx);
      const subs = subEvents.filter((s) => s.team === teamIdx);
      const onPitch = [];
      team.players.forEach((p, idx) => {
        if (idx < 11) {
          if (redEvents.some((r) => r.player === p && r.minute < timeMinute)) return; // 已被罚下
          if (subs.some((s) => s.out === p && s.minute < timeMinute)) return;          // 已被换下
          onPitch.push(p);
        } else if (subs.some((s) => s.in === p && s.minute < timeMinute)) {
          onPitch.push(p); // 替补已登场
        }
      });
      return onPitch;
    }

    /* ---- 8. 黄牌校验：吃牌者必须在场（被换下/罚下后不再吃牌） ---- */
    ['home', 'away'].forEach((sideKey) => {
      const teamIdx = sideKey === 'home' ? 0 : 1;
      yellows[sideKey].forEach((y) => {
        if (onPitchPlayers(teamIdx, y.minute).includes(y.player)) return;
        const booked = yellows[sideKey].filter((x) => x !== y).map((x) => x.player);
        const pool = onPitchPlayers(teamIdx, y.minute).filter((p) => !booked.includes(p));
        if (pool.length > 0) {
          y.player = pickWeighted(pool, (p) => POS_WEIGHT_YELLOW[p.pos] || 0, rng);
        }
      });
    });

    /* ---- 9. 红牌校验：两黄变一红的球员必须仍持有早前黄牌且在场，
              直接红牌的球员必须在场；不成立则改选在场球员 ---- */
    redPlayerEvents.forEach((r) => {
      const sideKey = r.team === 0 ? 'home' : 'away';
      const stillBooked = r.kind === 'second' &&
        yellows[sideKey].some((y) => y.player === r.player && y.minute < r.minute);
      const onPitch = onPitchPlayers(r.team, r.minute).includes(r.player);
      const valid = r.kind === 'second' ? (stillBooked && onPitch) : onPitch;
      if (valid) return;
      // 原选择不成立 → 改为直接红牌，另选在场且未参与换人的球员
      const booked = yellows[sideKey].map((y) => y.player);
      const subsOut = subEvents.filter((s) => s.team === r.team).map((s) => s.out);
      const pool = onPitchPlayers(r.team, r.minute)
        .filter((p) => !booked.includes(p))
        .filter((p) => !subsOut.includes(p)); // 红牌球员不能再出现在换人名单
      if (pool.length > 0) {
        r.player = pickWeighted(pool, (p) => POS_WEIGHT_YELLOW[p.pos] || 0, rng);
        r.kind = 'straight';
        r.text = '直接红牌！暴力行为';
      }
    });

    /* ---- 10. 进球球员分配：必须是进球时在场上的球员 ---- */
    goalEvents.forEach((g) => {
      const scoringTeam = g.team === 0 ? home : away;
      if (g.type === 'owngoal') {
        const oppIdx = g.team === 0 ? 1 : 0;
        const pool = onPitchPlayers(oppIdx, effMin(g.time));
        g.scorer = pickWeighted(pool, (p) => POS_WEIGHT_OWNGOL[p.pos] || 0, rng);
        g.scorerTeam = oppIdx;
        g.assist = null;
        return;
      }
      const weights = g.type === 'penalty' ? POS_WEIGHT_PENALTY : POS_WEIGHT_GOAL;
      const pool = onPitchPlayers(g.team, effMin(g.time));
      g.scorer = pickWeighted(pool, (p) => {
        const w = weights[p.pos] || 0;
        const r = playerRating(p, scoringTeam.strength);
        return w * r * r;
      }, rng);
      g.scorerTeam = g.team;
      if (g.type === 'goal' && rng() < 0.72) {
        const assistPool = onPitchPlayers(g.team, effMin(g.time)).filter((p) => p !== g.scorer);
        g.assist = pickWeighted(assistPool, (p) => {
          const w = POS_WEIGHT_ASSIST[p.pos] || 0;
          const r = playerRating(p, scoringTeam.strength);
          return w * r * r;
        }, rng);
      } else {
        g.assist = null;
      }
    });

    /* ---- 11. VAR 取消进球的球员：同样必须在场 ---- */
    disallowedEvents.forEach((d) => {
      const team = d.team === 0 ? home : away;
      const pool = onPitchPlayers(d.team, effMin(d.time));
      d.scorer = pickWeighted(pool, (p) => {
        const w = POS_WEIGHT_GOAL[p.pos] || 0;
        const r = playerRating(p, team.strength);
        return w * r * r;
      }, rng);
    });

    /* ---- 12. 汇总为时间线事件 ---- */
    events.push(ev(1, 0, 'center', 'kickoff', '🟢 开场哨响', `${home.nameZh} vs ${away.nameZh}，比赛开始！`));

    goalEvents.forEach((g) => {
      const side = g.team === 0 ? 'home' : 'away';
      const conceding = g.team === 0 ? away : home;
      const meta = { team: g.team, scorer: g.scorer, assist: g.assist, scorerTeam: g.scorerTeam };
      if (g.type === 'owngoal') {
        events.push(ev(g.time.minute, g.time.stoppage, side, 'owngoal', '🥅 乌龙球',
          `${g.scorer.name} 自摆乌龙！`, `${conceding.nameZh} 送给对方一份大礼`, null, meta));
      } else if (g.type === 'penalty') {
        events.push(ev(g.time.minute, g.time.stoppage, side, 'goal', '⚽ 点球命中',
          `${g.scorer.name} 主罚点球一蹴而就！`, null, null, meta));
      } else {
        events.push(ev(g.time.minute, g.time.stoppage, side, 'goal', '⚽ 进球！',
          `${g.scorer.name} 破门得分！`, g.assist ? `${g.assist.name} 送上助攻` : null, null, meta));
      }
    });

    disallowedEvents.forEach((d) => {
      const side = d.team === 0 ? 'home' : 'away';
      events.push(ev(d.time.minute, d.time.stoppage, side, 'disallowed', '❌ 进球取消',
        `${d.scorer.name} 的进球被判无效`, `VAR 回放：${d.reason}`, null,
        { team: d.team, scorer: d.scorer }));
    });

    yellows.home.forEach((y) => {
      events.push(ev(y.minute, 0, 'home', 'yellow', '黄牌',
        `${y.player.name} 犯规吃到黄牌`, null, null, { team: 0, player: y.player }));
    });
    yellows.away.forEach((y) => {
      events.push(ev(y.minute, 0, 'away', 'yellow', '黄牌',
        `${y.player.name} 犯规吃到黄牌`, null, null, { team: 1, player: y.player }));
    });

    redPlayerEvents.forEach((r) => {
      events.push(ev(r.minute, 0, r.team === 0 ? 'home' : 'away', 'red', '🟥 红牌',
        `${r.player.name} 被罚下场`, r.text, null, { team: r.team, player: r.player }));
    });

    subEvents.forEach((s) => {
      events.push(ev(s.minute, 0, s.team === 0 ? 'home' : 'away', 'sub', '🔁 换人',
        `${s.in.name} 登场`, `${s.out.name} 被换下`, null, { team: s.team, in: s.in, out: s.out }));
    });

    // 半场哨与终场哨（比分在排序后统一回填）
    events.push(ev(45, 0, 'center', 'halftime', '⏱ 半场休息', ''));
    events.push(ev(90, stoppage, 'center', 'final', '🏁 终场哨响', ''));

    // 按时间排序并回填进球后比分
    const sorted = sortEvents(events);
    let h = 0, a = 0;
    sorted.forEach((e) => {
      if (e.type === 'goal' || e.type === 'owngoal') {
        if (e.side === 'home') h++; else a++;
        e.score = h + '-' + a;
      }
      if (e.type === 'halftime') e.text = `半场比分 ${h}-${a}`;
      if (e.type === 'final') e.text = `全场比赛结束，${home.nameZh} ${h}-${a} ${away.nameZh}`;
    });
    const inserted = sorted;

    /* ---- 13. 技术统计 ---- */
    const stats = {};
    [ [0, home], [1, away] ].forEach(([idx, team]) => {
      const goals = idx === 0 ? h : a;
      const shotsOn = goals + poisson(2.2, rng);
      const shots = Math.max(shotsOn, goals + poisson(2.6, rng));
      stats[idx === 0 ? 'home' : 'away'] = {
        goals,
        shots,
        shotsOn,
        corners: 2 + poisson(3.0, rng) + goals,
        fouls: (idx === 0 ? yellows.home.length : yellows.away.length) * 2 + poisson(5, rng),
        yellows: idx === 0 ? yellows.home.length : yellows.away.length,
        offsides: poisson(1.7, rng),
        saves: 0 // 下方修正：扑救 = 对方射正 - 对方进球
      };
    });
    stats.home.saves = Math.max(0, stats.away.shotsOn - stats.away.goals);
    stats.away.saves = Math.max(0, stats.home.shotsOn - stats.home.goals);

    const possessionHome = clamp(Math.round(50 + (home.strength - away.strength) * 0.45 + (rng() * 12 - 6)), 30, 70);

    /* ---- 14. 全场最佳 ---- */
    const contributions = {};
    const addContribution = (player, pts) => {
      if (!player) return;
      contributions[player.name] = (contributions[player.name] || 0) + pts;
    };
    goalEvents.forEach((g) => {
      if (g.type === 'owngoal') return;
      addContribution(g.scorer, 3);
      addContribution(g.assist, 1.5);
    });
    let mvp = null;
    Object.keys(contributions).forEach((name) => {
      if (!mvp || contributions[name] > contributions[mvp.name]) mvp = { name, pts: contributions[name] };
    });

    return {
      seed,
      home,
      away,
      homeGoals: h,
      awayGoals: a,
      events: inserted,
      stats,
      possession: { home: possessionHome, away: 100 - possessionHome },
      mvp,
      lambda: { home: lambdaHome, away: lambdaAway },
        startingXI: { home: home.players.slice(0, 11), away: away.players.slice(0, 11) },
        formations: { home: home.formation || '4-3-3', away: away.formation || '4-3-3' }
    };
  }

  /* ---------------- 胜平负概率（蒙特卡洛） ---------------- */

  /**
   * 基于双方 λ 估计胜平负概率
   * 用 6000 次泊松抽样近似，足够精确
   */
  function winProbabilities(home, away) {
    const ratio = (home.strength + 3) / away.strength;
    const lh = clamp(1.42 * Math.pow(ratio, 1.5), 0.25, 4.8);
    const la = clamp(1.42 / Math.pow(ratio, 1.5), 0.25, 4.8);
    const seed = hashStr(home.id + '|' + away.id) ^ hashStr('odds');
    const rng = mulberry32(seed);
    let w = 0, d = 0, l = 0;
    const N = 6000;
    for (let i = 0; i < N; i++) {
      const gh = poisson(lh, rng);
      const ga = poisson(la, rng);
      if (gh > ga) w++;
      else if (gh < ga) l++;
      else d++;
    }
    return { home: w / N, draw: d / N, away: l / N };
  }

  /* ---------------- 导出 ---------------- */

  global.Simulation = {
    simulateMatch,
    winProbabilities,
    playerRating,
    hashStr
  };

})(typeof window !== 'undefined' ? window : globalThis);

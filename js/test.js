/* =========================================================
 * test.js — Node 端自检脚本（不影响网页运行）
 * 用法：node js/test.js
 * 校验：
 *   1. 球队数据完整性（36 队 / 人数 / 位置构成 / 唯一性）
 *   2. 模拟引擎一致性（事件排序 / 比分累计 / 球员归属 / 事件类型覆盖）
 * ========================================================= */

'use strict';

require('./teams_full.js');
require('./simulation.js');

const S = globalThis.Simulation;
const TEAMS = globalThis.TEAMS;

let failures = 0;
const fail = (msg) => { failures++; console.error('  ✗ ' + msg); };
const ok = (msg) => console.log('  ✓ ' + msg);

/* ---------------- 1. 数据完整性 ---------------- */
console.log('\n[1] 球队数据完整性');
ok('球队总数 = ' + TEAMS.length + (TEAMS.length === 36 ? '' : '（应为 36！）'));
if (TEAMS.length !== 36) fail('球队数不是 36');

const ids = new Set();
const playerNames = new Map();
TEAMS.forEach((t) => {
  if (!t.id || ids.has(t.id)) fail('id 缺失或重复: ' + t.id);
  ids.add(t.id);
  if (!t.name || !t.nameZh || !t.country || !t.flag) fail('基本信息缺失: ' + (t.id || '?'));
  if (t.pot < 1 || t.pot > 4) fail('档位非法: ' + t.id);
  if (t.strength < 40 || t.strength > 100) fail('实力分非法: ' + t.id);
  if (t.players.length !== 23) fail(t.nameZh + ' 球员数 = ' + t.players.length + '（应为 23）');
  const posCount = { GK: 0, DF: 0, MF: 0, FW: 0 };
  const nameSet = new Set();
  t.players.forEach((p) => {
    if (!['GK', 'DF', 'MF', 'FW'].includes(p.pos)) fail(t.nameZh + ' 位置非法: ' + p.name + '=' + p.pos);
    posCount[p.pos]++;
    if (nameSet.has(p.name)) fail(t.nameZh + ' 球员重名: ' + p.name);
    nameSet.add(p.name);
    if (!playerNames.has(p.name)) playerNames.set(p.name, []);
    playerNames.get(p.name).push(t.id);
  });
  if (posCount.GK !== 3) fail(t.nameZh + ' 门将数 = ' + posCount.GK + '（应为 3）');
  if (posCount.DF !== 8) fail(t.nameZh + ' 后卫数 = ' + posCount.DF + '（应为 8）');
  if (posCount.MF !== 6) fail(t.nameZh + ' 中场数 = ' + posCount.MF + '（应为 6）');
  if (posCount.FW !== 6) fail(t.nameZh + ' 前锋数 = ' + posCount.FW + '（应为 6）');
    if (!t.formation) fail(t.nameZh + ' 缺少阵型');
});
ok('36 队基本字段、档位、实力分校验完成');

// 跨队重名（真实足球中同名人可能在不同队，仅提示不报错）
let crossDup = 0;
playerNames.forEach((teamIds2, name) => {
  if (teamIds2.length > 1) {
    crossDup++;
    console.log('  · 跨队同名（提示）: ' + name + ' → ' + teamIds2.map(id => TEAMS.find(t => t.id === id).nameZh).join(', '));
  }
});
ok('跨队同名检查完成（' + crossDup + ' 处，同名球员属正常现象）');

// 主场球场
let noStadium = 0;
TEAMS.forEach((t) => {
  if (!t.stadium) { noStadium++; fail(t.nameZh + ' 缺少主场球场'); }
});
ok('36 队主场球场全部配置' + (noStadium ? '（缺失 ' + noStadium + ' 队）' : ''));

// 档位分布
[1, 2, 3, 4].forEach((p) => {
  const n = TEAMS.filter((t) => t.pot === p).length;
  ok('第' + p + '档: ' + n + ' 队' + (n === 9 ? '' : '（应为 9！）'));
  if (n !== 9) fail('第' + p + '档不是 9 队');
});

/* ---------------- 2. 模拟一致性 ---------------- */
console.log('\n[2] 模拟引擎一致性（300 场随机对阵）');

const eventTypes = new Set();
const goalScoreDiff = [];
let totalGoals = 0, totalYellows = 0, totalReds = 0, totalSubs = 0, totalDisallowed = 0, totalOwn = 0;
const scoreCount = {};

for (let i = 0; i < 300; i++) {
  const h = TEAMS[Math.floor(Math.random() * TEAMS.length)];
  let a = TEAMS[Math.floor(Math.random() * TEAMS.length)];
  while (a.id === h.id) a = TEAMS[Math.floor(Math.random() * TEAMS.length)];
  const r = S.simulateMatch(h, a, 1000 + i);

  // 事件排序
  for (let j = 1; j < r.events.length; j++) {
    const p = r.events[j - 1], c = r.events[j];
    const kp = p.minute * 100 + p.stoppage, kc = c.minute * 100 + c.stoppage;
    if (kc < kp) fail('事件未按时间排序: ' + h.nameZh + ' vs ' + a.nameZh + ' @' + i);
  }

  // 比分累计与终场比分一致
  let hh = 0, aa = 0;
  r.events.forEach((e) => {
    eventTypes.add(e.type);
    if (e.type === 'goal' || e.type === 'owngoal') {
      if (e.side === 'home') hh++; else aa++;
      if (e.score !== hh + '-' + aa) fail('进球后比分错误: ' + e.score + ' 应为 ' + hh + '-' + aa);
      if (e.minute < 1 || e.minute > 90) fail('进球时间非法: ' + e.minute);
    }
    if (e.type === 'goal' || e.type === 'owngoal') totalGoals++;
    if (e.type === 'yellow') totalYellows++;
    if (e.type === 'red') totalReds++;
    if (e.type === 'sub') totalSubs++;
    if (e.type === 'disallowed') totalDisallowed++;
    if (e.type === 'owngoal') totalOwn++;
  });

  // 在场一致性：事件涉及的球员必须在该时刻正在场上
  // （防止「球员进球后才被换上」「被换下/罚下后仍进球/吃牌」等矛盾）
  const onPitch = (teamIdx, t) => {
    const players = (teamIdx === 0 ? h : a).players;
    const reds = r.events.filter((x) => x.type === 'red' && x.meta && x.meta.team === teamIdx);
    const subs = r.events.filter((x) => x.type === 'sub' && x.meta && x.meta.team === teamIdx);
    const list = [];
    players.forEach((p, idx) => {
      if (idx < 11) {
        if (reds.some((x) => x.meta.player === p && x.minute + x.stoppage < t)) return; // 罚下后
        if (subs.some((x) => x.meta.out === p && x.minute < t)) return;                 // 换下后
        list.push(p);
      } else if (subs.some((x) => x.meta.in === p && x.minute < t)) {
        list.push(p); // 替补登场后
      }
    });
    return list;
  };
  r.events.forEach((e) => {
    if (!e.meta) return;
    const t = e.minute + e.stoppage;
    if ((e.type === 'goal' || e.type === 'owngoal') && e.meta.scorer) {
      if (!onPitch(e.meta.scorerTeam, t).includes(e.meta.scorer)) {
        fail('进球者不在场: ' + e.meta.scorer.name + ' 第' + e.minute + '分钟 @' + h.nameZh + ' vs ' + a.nameZh);
      }
      if (e.meta.assist && !onPitch(e.meta.team, t).includes(e.meta.assist)) {
        fail('助攻者不在场: ' + e.meta.assist.name + ' 第' + e.minute + '分钟 @' + h.nameZh + ' vs ' + a.nameZh);
      }
    }
    if (e.type === 'disallowed' && e.meta.scorer && !onPitch(e.meta.team, t).includes(e.meta.scorer)) {
      fail('VAR取消进球者不在场: ' + e.meta.scorer.name);
    }
    if (e.type === 'yellow' && e.meta.player && !onPitch(e.meta.team, t).includes(e.meta.player)) {
      fail('吃牌者不在场: ' + e.meta.player.name + ' 第' + e.minute + '分钟');
    }
    if (e.type === 'red' && e.meta.player && !onPitch(e.meta.team, t).includes(e.meta.player)) {
      fail('红牌球员不在场: ' + e.meta.player.name + ' 第' + e.minute + '分钟');
    }
    if (e.type === 'sub' && e.meta.out && !onPitch(e.meta.team, t).includes(e.meta.out)) {
      fail('被换下者当时不在场: ' + e.meta.out.name + ' 第' + e.minute + '分钟');
    }
    if (e.type === 'sub' && e.meta.in && onPitch(e.meta.team, t - 0.5).includes(e.meta.in)) {
      fail('登场者当时已在场: ' + e.meta.in.name + ' 第' + e.minute + '分钟');
    }
  });
  if (hh !== r.homeGoals || aa !== r.awayGoals) fail('终场比分与累计不一致: ' + hh + '-' + aa + ' vs ' + r.homeGoals + '-' + r.awayGoals);
  if (goalScoreDiff.push(r.homeGoals - r.awayGoals) > 300) {}

  // 技术统计一致性
  if (r.stats.home.goals !== r.homeGoals) fail('统计进球不一致');
  if (r.stats.home.shots < r.stats.home.shotsOn) fail('射门 < 射正');
  if (r.stats.home.shotsOn < r.stats.home.goals) fail('射正 < 进球');
  if (r.stats.home.saves < 0) fail('扑救为负');
  if (r.possession.home + r.possession.away !== 100) fail('控球率之和不为 100');

  // 开场与终场哨必须在时间线上
  if (r.events[0].type !== 'kickoff') fail('首事件不是开场哨');
  if (r.events[r.events.length - 1].type !== 'final') fail('末事件不是终场哨');

  const key = r.homeGoals + '-' + r.awayGoals;
  scoreCount[key] = (scoreCount[key] || 0) + 1;
}

ok('300 场模拟：事件排序、比分累计、技术统计一致性全部通过');
ok('事件类型覆盖: ' + [...eventTypes].sort().join(', '));
['goal', 'disallowed', 'yellow', 'red', 'sub', 'owngoal', 'kickoff', 'halftime', 'final'].forEach((t) => {
  if (!eventTypes.has(t)) fail('缺少事件类型: ' + t);
});
ok('总进球 ' + totalGoals + ' | 黄牌 ' + totalYellows + ' | 红牌 ' + totalReds +
   ' | 换人 ' + totalSubs + ' | VAR取消 ' + totalDisallowed + ' | 乌龙 ' + totalOwn);
console.log('  最常见比分: ' + Object.entries(scoreCount).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([s, n]) => s + '×' + n).join('  '));

/* ---------------- 3. 样例时间线 ---------------- */
console.log('\n[3] 样例时间线（皇马 vs 巴黎圣日耳曼，种子 20260831）');
const rm = TEAMS.find((t) => t.id === 'real-madrid');
const psg = TEAMS.find((t) => t.id === 'psg');
const sample = S.simulateMatch(rm, psg, 20260831);
console.log(`\n  ${rm.nameZh} ${sample.homeGoals} - ${sample.awayGoals} ${psg.nameZh}`);
console.log(`  控球 ${sample.possession.home}% - ${sample.possession.away}%  全场最佳: ${sample.mvp ? sample.mvp.name : '无'}`);
sample.events.forEach((e) => {
  const t = e.stoppage > 0 ? `90+${e.stoppage}'` : `${e.minute}'`;
  const pad = e.side === 'away' ? '                    ' : '';
  const tag = { goal: '⚽', owngoal: '🥅', disallowed: '❌', yellow: '🟨', red: '🟥', sub: '🔁', kickoff: '🟢', halftime: '⏱', final: '🏁' }[e.type];
  console.log(`  ${pad}${t.padStart(6)} ${tag} ${e.text || e.title}${e.subtext ? '（' + e.subtext + '）' : ''}${e.score ? ' [' + e.score + ']' : ''}`);
});

/* ---------------- 汇总 ---------------- */
console.log('\n========================================');
if (failures === 0) {
  console.log('✅ 全部校验通过，未发现问题。');
  process.exit(0);
} else {
  console.error(`❌ 共 ${failures} 处问题。`);
  process.exit(1);
}

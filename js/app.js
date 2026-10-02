/* =========================================================
 * app.js — 页面交互逻辑
 * 选队 / 抽签动画 / 胜率预览 / 模拟比赛 / 时间轴渲染 / 播放
 * ========================================================= */

(function () {
  'use strict';

  const S = window.Simulation;

  /* ---------------- 状态 ---------------- */
  const state = {
    home: null,
    away: null,
    result: null,
    pendingSide: 'home', // 当前选队弹窗在为哪一侧选队
    drawing: false,
    playing: null // { rows, idx, timer } | null
  };

  /* ---------------- DOM 引用 ---------------- */
  const $ = (id) => document.getElementById(id);
  const dom = {
    homeSlot: $('homeSlot'), awaySlot: $('awaySlot'),
    homeFlag: $('homeFlag'), homeName: $('homeName'), homeCountry: $('homeCountry'),
    homeStrength: $('homeStrength'), homeHint: $('homeHint'),
    awayFlag: $('awayFlag'), awayName: $('awayName'), awayCountry: $('awayCountry'),
    awayStrength: $('awayStrength'), awayHint: $('awayHint'),
    drawBtn: $('drawBtn'), swapBtn: $('swapBtn'), predictBtn: $('predictBtn'),
    oddsPreview: $('oddsPreview'),
    oddsHomeBar: $('oddsHomeBar'), oddsDrawBar: $('oddsDrawBar'), oddsAwayBar: $('oddsAwayBar'),
    oddsHomeLabel: $('oddsHomeLabel'), oddsDrawLabel: $('oddsDrawLabel'), oddsAwayLabel: $('oddsAwayLabel'),
    selectPanel: $('selectPanel'), resultPanel: $('resultPanel'),
    sbHomeFlag: $('sbHomeFlag'), sbHomeName: $('sbHomeName'), sbHomeCountry: $('sbHomeCountry'),
    sbAwayFlag: $('sbAwayFlag'), sbAwayName: $('sbAwayName'), sbAwayCountry: $('sbAwayCountry'),
    scoreHome: $('scoreHome'), scoreAway: $('scoreAway'),
    sbStadium: $('sbStadium'), sbStatus: $('sbStatus'), sbMvpWrap: $('sbMvpWrap'),
    statsGrid: $('statsGrid'), lineupsWrap: $('lineupsWrap'), timeline: $('timeline'),
    replayBtn: $('replayBtn'), playBtn: $('playBtn'), backBtn: $('backBtn'),
    pickerModal: $('pickerModal'), pickerTitle: $('pickerTitle'),
    pickerSearch: $('pickerSearch'), pickerClose: $('pickerClose'), pickerGrid: $('pickerGrid')
  };

  /* ---------------- 工具 ---------------- */
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function fmtTime(ev) {
    return ev.stoppage > 0 ? `90+${ev.stoppage}'` : `${ev.minute}'`;
  }

  /* ---------------- 选队弹窗 ---------------- */
  const POT_LABELS = {
    1: '第一档 · 种子队',
    2: '第二档',
    3: '第三档',
    4: '第四档'
  };

  function buildPickerGrid() {
    dom.pickerGrid.innerHTML = '';
    [1, 2, 3, 4].forEach((pot) => {
      const group = document.createElement('div');
      group.className = 'pot-group';
      group.innerHTML = `<div class="pot-label">${POT_LABELS[pot]}<small>共 ${TEAMS.filter(t => t.pot === pot).length} 支</small></div>`;
      const grid = document.createElement('div');
      grid.className = 'team-grid';
      TEAMS.filter((t) => t.pot === pot).forEach((t) => {
        const chip = document.createElement('button');
        chip.className = 'team-chip';
        chip.innerHTML = `
          <span class="chip-flag">${t.flag}</span>
          <span class="chip-name">${escapeHTML(t.nameZh)}</span>
          <span class="chip-str">${t.strength}</span>`;
        if ((state.pendingSide === 'home' && state.away === t) ||
            (state.pendingSide === 'away' && state.home === t)) {
          chip.classList.add('picked'); // 已在另一侧被选中
        }
        chip.addEventListener('click', () => pickTeam(t));
        grid.appendChild(chip);
      });
      group.appendChild(grid);
      dom.pickerGrid.appendChild(group);
    });
  }

  function openPicker(side) {
    if (state.drawing) return;
    stopPlay();
    state.pendingSide = side;
    dom.pickerTitle.textContent = side === 'home' ? '选择主队' : '选择客队';
    dom.pickerSearch.value = '';
    buildPickerGrid();
    dom.pickerModal.classList.remove('hidden');
    setTimeout(() => dom.pickerSearch.focus(), 50);
  }

  function closePicker() {
    dom.pickerModal.classList.add('hidden');
  }

  function pickTeam(team) {
    const other = state.pendingSide === 'home' ? state.away : state.home;
    if (other && other.id === team.id) {
      flashSlot(state.pendingSide === 'home' ? 'away' : 'home');
      return; // 不能选同一支球队
    }
    if (state.pendingSide === 'home') state.home = team;
    else state.away = team;
    closePicker();
    renderSlots();
    refreshPredictState();
  }

  function flashSlot(side) {
    const el = side === 'home' ? dom.homeSlot : dom.awaySlot;
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 700);
  }

  /* ---------------- 槽位渲染 ---------------- */
  function fillSlot(side, team) {
    const pre = side === 'home' ? 'home' : 'away';
    if (!team) {
      dom[pre + 'Flag'].textContent = '🎯';
      dom[pre + 'Name'].textContent = side === 'home' ? '选择主队' : '选择客队';
      dom[pre + 'Country'].textContent = '';
      dom[pre + 'Strength'].classList.add('hidden');
      dom[pre + 'Hint'].classList.remove('hidden');
      dom[pre + 'Slot'].classList.remove('filled');
      return;
    }
    dom[pre + 'Flag'].textContent = team.flag;
    dom[pre + 'Name'].textContent = team.nameZh;
    dom[pre + 'Country'].textContent = team.country + ' · 第' + team.pot + '档';
    dom[pre + 'Strength'].textContent = '综合实力 ' + team.strength;
    dom[pre + 'Strength'].classList.remove('hidden');
    dom[pre + 'Hint'].classList.add('hidden');
    dom[pre + 'Slot'].classList.add('filled');
  }

  function renderSlots() {
    fillSlot('home', state.home);
    fillSlot('away', state.away);
  }

  /* ---------------- 胜率预览 ---------------- */
  function refreshPredictState() {
    const ready = state.home && state.away && state.home.id !== state.away.id;
    dom.predictBtn.disabled = !ready;
    if (ready) {
      const p = S.winProbabilities(state.home, state.away);
      const ph = Math.round(p.home * 100);
      const pd = Math.round(p.draw * 100);
      const pa = Math.round(p.away * 100);
      dom.oddsHomeBar.style.width = ph + '%';
      dom.oddsDrawBar.style.width = pd + '%';
      dom.oddsAwayBar.style.width = pa + '%';
      dom.oddsHomeBar.textContent = ph + '%';
      dom.oddsDrawBar.textContent = pd + '%';
      dom.oddsAwayBar.textContent = pa + '%';
      dom.oddsHomeLabel.textContent = `${state.home.nameZh} 胜 ${ph}%`;
      dom.oddsDrawLabel.textContent = `平局 ${pd}%`;
      dom.oddsAwayLabel.textContent = `客胜 ${pa}%`;
      dom.oddsPreview.classList.remove('hidden');
    } else {
      dom.oddsPreview.classList.add('hidden');
    }
  }

  /* ---------------- 随机抽签（动画） ---------------- */
  function startDraw() {
    if (state.drawing) return;
    stopPlay();
    state.drawing = true;
    dom.drawBtn.disabled = true;
    dom.predictBtn.disabled = true;

    const start = Date.now();
    const DURATION = 1500;
    const timer = setInterval(() => {
      // 快速轮换随机球队制造滚动效果
      const t1 = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      let t2 = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      while (t2.id === t1.id) t2 = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      state.home = t1;
      state.away = t2;
      renderSlots();

      if (Date.now() - start >= DURATION) {
        clearInterval(timer);
        state.drawing = false;
        dom.drawBtn.disabled = false;
        refreshPredictState();
      }
    }, 70);
  }

  /* ---------------- 模拟比赛 ---------------- */
  function runSimulation() {
    if (!state.home || !state.away || state.home.id === state.away.id) return;
    stopPlay();
    state.result = S.simulateMatch(state.home, state.away);
    renderResult(state.result);
    dom.selectPanel.classList.add('hidden');
    dom.resultPanel.classList.remove('hidden');
    dom.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderResult(result) {
    const h = result.home, a = result.away;
    dom.sbHomeFlag.textContent = h.flag;
    dom.sbHomeName.textContent = h.nameZh;
    dom.sbHomeCountry.textContent = h.country + ' · 主队';
    dom.sbAwayFlag.textContent = a.flag;
    dom.sbAwayName.textContent = a.nameZh;
    dom.sbAwayCountry.textContent = a.country + ' · 客队';
    dom.scoreHome.textContent = result.homeGoals;
    dom.scoreAway.textContent = result.awayGoals;

    // 球场：主场球队的主场（矿工等特殊情况见 teams.js 注释）
    dom.sbStadium.textContent = `🏟 ${h.nameZh} 主场 · ${h.stadium || '中立球场'}`;
    dom.sbStatus.textContent = ' · 全场结束（模拟 #' + result.seed + '）';

    dom.sbMvpWrap.innerHTML = result.mvp
      ? `<span class="sb-mvp">🎖 全场最佳：${escapeHTML(result.mvp.name)}</span>`
      : `<span class="sb-mvp">🤝 双方握手言和，无突出球员</span>`;

    renderLineups(result);
      renderStats(result);
    renderTimeline(result);
    dom.playBtn.textContent = '▶ 播放赛况';
    dom.playBtn.disabled = false;
  }

  /* ---------------- 技术统计 ---------------- */
  function renderStats(result) {
    const sh = result.stats.home, sa = result.stats.away;
    const rows = [
      ['射门', sh.shots, sa.shots],
      ['射正', sh.shotsOn, sa.shotsOn],
      ['角球', sh.corners, sa.corners],
      ['越位', sh.offsides, sa.offsides],
      ['犯规', sh.fouls, sa.fouls],
      ['黄牌', sh.yellows, sa.yellows],
      ['扑救', sh.saves, sa.saves]
    ];
    const pos = result.possession;

    dom.statsGrid.innerHTML = `
      <div class="stat-row">
        <div class="stat-val stat-home">${pos.home}%</div>
        <div class="stat-label">控球率</div>
        <div class="stat-val stat-away">${pos.away}%</div>
      </div>
      <div class="possession-row">
        <div class="pos-h" style="width:${pos.home}%"></div>
        <div class="pos-a" style="width:${pos.away}%"></div>
      </div>
      ${rows.map(([label, hv, av]) => `
        <div class="stat-row">
          <div class="stat-val stat-home">${hv}</div>
          <div class="stat-label">${label}</div>
          <div class="stat-val stat-away">${av}</div>
        </div>`).join('')}`;
  }
/* ---------------- 首发阵容 ---------------- */
    function renderLineups(result) {
      const homeXI = result.startingXI.home;
      const awayXI = result.startingXI.away;
      const homeFormation = result.formations.home;
      const awayFormation = result.formations.away;

      function buildLineupHTML(players, formation, teamName, side) {
        const gk = players.filter(p => p.pos === 'GK');
        const df = players.filter(p => p.pos === 'DF');
        const mf = players.filter(p => p.pos === 'MF');
        const fw = players.filter(p => p.pos === 'FW');

        const positionLabel = { GK: '门将', DF: '后卫', MF: '中场', FW: '前锋' };

        return `
          <div class="lineup-col lineup-${side}">
            <div class="lineup-header">
              <span class="lineup-team">${escapeHTML(teamName)}</span>
              <span class="lineup-formation">${escapeHTML(formation)}</span>
            </div>
            <div class="lineup-rows">
              <div class="lineup-pos-group">
                <span class="lineup-pos-label">🧤 ${positionLabel['GK']}</span>
                <div class="lineup-names">${gk.map(p => `<span class="lineup-player">${escapeHTML(p.name)}</span>`).join('')}</div>
              </div>
              <div class="lineup-pos-group">
                <span class="lineup-pos-label">🛡 ${positionLabel['DF']}</span>
                <div class="lineup-names">${df.map(p => `<span class="lineup-player">${escapeHTML(p.name)}</span>`).join('')}</div>
              </div>
              <div class="lineup-pos-group">
                <span class="lineup-pos-label">🔗 ${positionLabel['MF']}</span>
                <div class="lineup-names">${mf.map(p => `<span class="lineup-player">${escapeHTML(p.name)}</span>`).join('')}</div>
              </div>
              <div class="lineup-pos-group">
                <span class="lineup-pos-label">⚡ ${positionLabel['FW']}</span>
                <div class="lineup-names">${fw.map(p => `<span class="lineup-player">${escapeHTML(p.name)}</span>`).join('')}</div>
              </div>
            </div>
          </div>`;
      }

      const lineupHTML = `
        <div class="lineups-container">
          <h3 class="lineups-title">📋 首发阵容</h3>
          <div class="lineups-grid">
            ${buildLineupHTML(homeXI, homeFormation, result.home.nameZh, 'home')}
            ${buildLineupHTML(awayXI, awayFormation, result.away.nameZh, 'away')}
          </div>
        </div>`;

      dom.lineupsWrap.innerHTML = lineupHTML;
    }

  /* ---------------- 时间轴 ---------------- */
  function eventCardHTML(ev) {
    let main, sub = ev.subtext ? `<div class="tl-sub">${escapeHTML(ev.subtext)}</div>` : '';
    const chip = ev.score ? `<span class="score-chip">${escapeHTML(ev.score)}</span>` : '';
    switch (ev.type) {
      case 'goal':
        main = `<span class="ev-icon">⚽</span>${escapeHTML(ev.text)}${chip}`;
        break;
      case 'owngoal':
        main = `<span class="ev-icon">🥅</span>${escapeHTML(ev.text)}${chip}`;
        break;
      case 'disallowed':
        main = `<span class="ev-icon">❌</span>${escapeHTML(ev.text)}`;
        break;
      case 'yellow':
        main = `<span class="card-rect card-y"></span>${escapeHTML(ev.text)}`;
        break;
      case 'red':
        main = `<span class="card-rect card-r"></span>${escapeHTML(ev.text)}`;
        break;
      case 'sub':
        main = `<span class="ev-icon">🔁</span>${escapeHTML(ev.text)}`;
        break;
      default:
        main = escapeHTML(ev.text || '');
    }
    return `<div class="tl-card">${main}${sub}</div>`;
  }

  function renderTimeline(result) {
    // 图例：主队居左、客队居右，与事件卡片分列一致
    dom.timeline.innerHTML = `
      <div class="tl-legend">
        <span class="legend-home">${escapeHTML(result.home.nameZh)}</span>
        <span class="legend-time">时间</span>
        <span class="legend-away">${escapeHTML(result.away.nameZh)}</span>
      </div>`;
    result.events.forEach((ev) => {
      const row = document.createElement('div');
      row.className = `tl-row tl-${ev.type} tl-${ev.side}`;
      const time = fmtTime(ev);
      if (ev.side === 'center') {
        row.innerHTML = `
          <div class="tl-cell">
            <div class="tl-card">
              <span class="tl-time">${time}</span>
              <span class="tl-main">${escapeHTML(ev.title)}</span>
              ${ev.text ? `<span class="tl-text">${escapeHTML(ev.text)}</span>` : ''}
            </div>
          </div>`;
      } else {
        row.innerHTML = `
          <div class="tl-cell tl-left">${ev.side === 'home' ? eventCardHTML(ev) : ''}</div>
          <div class="tl-axis"><span class="tl-time">${time}</span></div>
          <div class="tl-cell tl-right">${ev.side === 'away' ? eventCardHTML(ev) : ''}</div>`;
      }
      dom.timeline.appendChild(row);
    });
  }

  /* ---------------- 播放赛况 ---------------- */
  function stopPlay() {
    if (!state.playing) return;
    clearInterval(state.playing.timer);
    state.playing.rows.forEach((r) => {
      r.el.classList.remove('tl-hidden', 'tl-now');
    });
    state.playing = null;
    if (state.result) {
      dom.scoreHome.textContent = state.result.homeGoals;
      dom.scoreAway.textContent = state.result.awayGoals;
      dom.playBtn.textContent = '▶ 播放赛况';
    }
  }

  function startPlay() {
    if (!state.result) return;
    if (state.playing) { stopPlay(); return; }

    const rows = Array.from(dom.timeline.querySelectorAll('.tl-row')).map((el, i) => ({
      el,
      ev: state.result.events[i]
    }));
    rows.forEach((r) => r.el.classList.add('tl-hidden'));
    dom.scoreHome.textContent = '0';
    dom.scoreAway.textContent = '0';
    dom.playBtn.textContent = '⏹ 快进到结束';

    let idx = 0;
    state.playing = { rows, idx, timer: null };
    state.playing.timer = setInterval(() => {
      if (idx >= rows.length) { stopPlay(); return; }
      if (idx > 0) rows[idx - 1].el.classList.remove('tl-now');
      const cur = rows[idx];
      cur.el.classList.remove('tl-hidden');
      cur.el.classList.add('tl-now');
      const ev = cur.ev;
      if (ev.type === 'goal' || ev.type === 'owngoal') {
        if (ev.side === 'home') dom.scoreHome.textContent = +dom.scoreHome.textContent + 1;
        else dom.scoreAway.textContent = +dom.scoreAway.textContent + 1;
      }
      cur.el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      idx++;
    }, 700);
  }

  /* ---------------- 事件绑定 ---------------- */
  dom.homeSlot.addEventListener('click', () => openPicker('home'));
  dom.awaySlot.addEventListener('click', () => openPicker('away'));
  dom.drawBtn.addEventListener('click', startDraw);
  dom.swapBtn.addEventListener('click', () => {
    if (state.drawing) return;
    const tmp = state.home; state.home = state.away; state.away = tmp;
    renderSlots();
    refreshPredictState();
  });
  dom.predictBtn.addEventListener('click', runSimulation);
  dom.replayBtn.addEventListener('click', runSimulation);
  dom.playBtn.addEventListener('click', startPlay);
  dom.backBtn.addEventListener('click', () => {
    stopPlay();
    dom.resultPanel.classList.add('hidden');
    dom.selectPanel.classList.remove('hidden');
    dom.selectPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  dom.pickerClose.addEventListener('click', closePicker);
  dom.pickerModal.addEventListener('click', (e) => {
    if (e.target === dom.pickerModal) closePicker();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dom.pickerModal.classList.contains('hidden')) closePicker();
  });
  dom.pickerSearch.addEventListener('input', () => {
    const q = dom.pickerSearch.value.trim().toLowerCase();
    dom.pickerGrid.querySelectorAll('.team-chip').forEach((chip) => {
      const t = TEAMS.find((x) => x.nameZh === chip.querySelector('.chip-name').textContent);
      const hit = !q ||
        t.name.toLowerCase().includes(q) ||
        t.nameZh.includes(q) ||
        t.country.includes(q);
      chip.style.display = hit ? '' : 'none';
    });
    // 隐藏空的组标题
    dom.pickerGrid.querySelectorAll('.pot-group').forEach((g) => {
      const anyVisible = Array.from(g.querySelectorAll('.team-chip'))
        .some((c) => c.style.display !== 'none');
      g.style.display = anyVisible ? '' : 'none';
    });
  });

  /* ---------------- 初始化 ---------------- */
  renderSlots();
  refreshPredictState();
})();

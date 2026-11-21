// Noyau du simulateur. Une appli = OS.register({...}) — voir apps/about.js
const OS = { apps: {}, wins: {}, tasks: {}, z: 10, walls: [
  ['Bleu', 'radial-gradient(ellipse at 75% 65%,#5cc0ff,#0078d7 38%,#062a5c 85%)'],
  ['Nuit', 'linear-gradient(135deg,#0b1020,#26325c)'],
  ['Forêt', 'linear-gradient(135deg,#0b3d2e,#3fa56b)'],
  ['Crépuscule', 'linear-gradient(135deg,#2b1055,#d4527b)']] };
const $ = s => document.querySelector(s);
const st = (k, d) => { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
const sv = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

OS.register = app => { OS.apps[app.id] = app; };
OS.user = () => st('sim-user', 'kévin');
OS.setUser = n => sv('sim-user', n.trim() || 'kévin');
OS.setWall = i => { sv('sim-wall', i); document.documentElement.style.setProperty('--wp', OS.walls[i][1]); };

OS.open = id => {
  const app = OS.apps[id]; if (!app) return;
  if (OS.wins[id]) { OS.wins[id].el.classList.remove('min'); return OS.focus(id); }
  const el = document.createElement('div');
  el.className = 'win';
  const n = Object.keys(OS.wins).length;
  Object.assign(el.style, { width: (app.w || 480) + 'px', height: (app.h || 340) + 'px', left: 80 + n * 28 + 'px', top: 40 + n * 28 + 'px' });
  el.innerHTML = `<div class="bar"><span>${app.icon}</span><b>${app.name}</b><button class="m">—</button><button class="z">▢</button><button class="x">✕</button></div><div class="body"></div>`;
  $('#desktop').appendChild(el);
  
  const task = OS.tasks[id]; 
  if (task) task.classList.add('open');
  
  const win = { id, el, task, close: () => OS.close(id) };
  OS.wins[id] = win;
  app.render(el.querySelector('.body'), win);
  el.addEventListener('pointerdown', () => OS.focus(id));
  el.querySelector('.x').onclick = win.close;
  el.querySelector('.m').onclick = () => { el.classList.add('min'); OS.focus(null); };
  el.querySelector('.z').onclick = () => el.classList.toggle('max');
  const bar = el.querySelector('.bar');
  bar.ondblclick = e => { if (e.target === bar || e.target.tagName === 'B') el.classList.toggle('max'); };
  bar.onpointerdown = e => {
    if (e.target.tagName === 'BUTTON' || el.classList.contains('max')) return;
    const dx = e.clientX - el.offsetLeft, dy = e.clientY - el.offsetTop;
    bar.setPointerCapture(e.pointerId);
    bar.onpointermove = m => { el.style.left = m.clientX - dx + 'px'; el.style.top = Math.max(0, m.clientY - dy) + 'px'; };
    bar.onpointerup = () => { bar.onpointermove = null; };
  };
  OS.focus(id);
};

OS.focus = id => {
  for (const k in OS.wins) {
    const on = k === id;
    OS.wins[k].el.classList.toggle('focus', on);
    if (OS.tasks[k]) OS.tasks[k].classList.toggle('active', on);
  }
  if (id) OS.wins[id].el.style.zIndex = ++OS.z;
};
OS.close = id => { const w = OS.wins[id]; if (!w) return; w.el.remove(); if (w.task) w.task.classList.remove('open', 'active'); delete OS.wins[id]; };
OS.closeAll = () => Object.keys(OS.wins).forEach(OS.close);

// menu contextuel générique : items = [[label, fonction], ...] ; up = s'ouvre vers le haut
OS.menu = (items, x, y, up) => {
  const m = $('#ctx'); m.innerHTML = '';
  items.forEach(([t, f]) => { const d = document.createElement('div'); d.textContent = t; d.onclick = () => { m.hidden = true; f(); }; m.appendChild(d); });
  m.hidden = false;
  m.style.left = Math.min(x, innerWidth - m.offsetWidth) + 'px';
  m.style.top = Math.max(0, Math.min(up ? y - m.offsetHeight : y, innerHeight - 40 - m.offsetHeight)) + 'px';
};

// alimentation : sleep | off | restart | lock | signout
OS.power = a => {
  if (a === 'off' || a === 'restart' || a === 'signout') OS.closeAll();
  if (a === 'sleep') return OS.screen('sleep');
  if (a === 'lock' || a === 'signout') return OS.screen('lock');
  OS.screen('wait', a === 'off' ? 'Arrêt en cours…' : 'Redémarrage…');
  setTimeout(() => OS.screen(a === 'off' ? 'off' : 'boot'), 2200);
};
OS.powerItems = [['Mettre en veille', () => OS.power('sleep')], ['Arrêter', () => OS.power('off')], ['Redémarrer', () => OS.power('restart')]];

// écrans plein écran : boot | lock | login | welcome | wait | sleep | off
OS.screen = (n, t) => {
  const s = $('#screen');
  $('#start').hidden = true; $('#startbtn').classList.remove('on'); $('#ctx').hidden = true;
  if (!n) { s.hidden = true; return; }
  const sp = '<div class="spin"></div>';
  s.hidden = false; s.className = n; s.onclick = null;
  s.innerHTML = {
    lock: '<div class="lt"><b id="lt"></b><span id="ld"></span></div>',
    login: `<div class="av">👤</div><h2>${OS.user()}</h2><form><input type="password" placeholder="Mot de passe" autocomplete="off"><button title="Se connecter">→</button></form><button type="button" class="pwr" title="Marche/Arrêt">⏻</button>`,
    welcome: `<h2>Bienvenue</h2>${sp}`,
    wait: `<h2>${t}</h2>${sp}`,
    boot: `<div class="logo"><i></i><i></i><i></i><i></i></div>${sp}`,
    sleep: '', off: '<small>Cliquer pour rallumer</small>'
  }[n];
  OS.tick();
  if (n === 'lock') s.onclick = () => OS.screen('login');
  if (n === 'sleep') s.onclick = () => OS.screen('lock');
  if (n === 'off') s.onclick = () => OS.screen('boot');
  if (n === 'boot') setTimeout(() => OS.screen('lock'), 2000);
  if (n === 'login') {
    s.querySelector('input').focus();
    s.querySelector('form').onsubmit = e => { e.preventDefault(); OS.screen('welcome'); setTimeout(() => OS.screen(null), 1800); };
    s.querySelector('.pwr').onclick = e => { const r = e.target.getBoundingClientRect(); OS.menu(OS.powerItems, r.left - 150, r.top, true); };
  }
};

OS.tick = () => {
  const d = new Date(), h = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  $('#clock').innerHTML = h + '<br>' + d.toLocaleDateString('fr-FR');
  if ($('#lt')) { $('#lt').textContent = h; $('#ld').textContent = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); }
};

OS.boot = () => {
  OS.setWall(+st('sim-wall', 0));
  const start = $('#start');
  const toggle = v => { start.hidden = !(v ?? start.hidden); $('#startbtn').classList.toggle('on', !start.hidden); if (!start.hidden) $('#usr span').textContent = OS.user(); };
  const icon = (ic, name, f) => { const d = document.createElement('div'); d.className = 'icon'; d.innerHTML = `<span>${ic}</span>${name}`; d.ondblclick = f; $('#desktop').appendChild(d); };
  
  // ICÔNE CORBEILLE (affichée immédiatement)
  icon('🗑️', 'Corbeille', () => OS.open('recycle'));
  
  // BOUCLE POUR LES AUTRES APPLIS (chargées dynamiquement)
  for (const a of Object.values(OS.apps)) {
    if (a.id === 'recycle') continue; // On saute la corbeille car elle est déjà affichée
    icon(a.icon, a.name, () => OS.open(a.id));
    const t = document.createElement('div'); t.className = 'tile'; t.innerHTML = `<span>${a.icon}</span>${a.name}`;
    t.onclick = () => { OS.open(a.id); toggle(false); };
    $('#tiles .grid').appendChild(t);
    const b = document.createElement('button'); b.className = 'task'; b.textContent = a.icon; b.title = a.name;
    b.onclick = () => {
      const w = OS.wins[a.id]; if (!w) return OS.open(a.id);
      if (w.el.classList.contains('min') || !w.el.classList.contains('focus')) { w.el.classList.remove('min'); OS.focus(a.id); }
      else { w.el.classList.add('min'); OS.focus(null); }
    };
    $('#tasks').appendChild(b); OS.tasks[a.id] = b;
  }
  $('#startbtn').onclick = () => toggle();
  $('#search').onclick = () => toggle(true);
  $('#hb').onclick = () => start.classList.toggle('wide');
  $('#set').onclick = () => { OS.open('settings'); toggle(false); };
  const side = (id, items) => $(id).onclick = e => { const r = e.currentTarget.getBoundingClientRect(); OS.menu(items, $('#rail').offsetWidth, r.bottom, true); };
  side('#usr', [['Verrouiller', () => OS.power('lock')], ['Se déconnecter', () => OS.power('signout')]]);
  side('#pwb', OS.powerItems);
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest('#ctx')) $('#ctx').hidden = true;
    if (!e.target.closest('#start,#startbtn,#search,#ctx')) toggle(false);
  });
  $('#desktop').oncontextmenu = e => {
    if (e.target.closest('.win')) return;
    e.preventDefault();
    OS.menu([['Actualiser', () => { const d = $('#desktop'); d.style.opacity = 0; setTimeout(() => d.style.opacity = 1, 90); }],
      ['Paramètres d’affichage', () => OS.open('settings')], ['Personnaliser', () => OS.open('settings')]], e.clientX, e.clientY);
  };
  addEventListener('keydown', () => { if ($('#screen').className === 'lock') OS.screen('login'); });
  OS.tick(); setInterval(OS.tick, 10000);
  OS.screen('boot');
};

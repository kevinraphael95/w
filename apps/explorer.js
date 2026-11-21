OS.register({
  id: 'explorer', name: 'Explorateur de fichiers', icon: '📁', w: 760, h: 460,
  render(box) {
    const F = [['Bureau', '🖥️'], ['Documents', '📄'], ['Images', '🖼️'], ['Musique', '🎵'], ['Objets 3D', '🧊'], ['Téléchargements', '⬇️'], ['Vidéos', '🎞️']];
    box.innerHTML = `<div class="ex-tabs"><b>Fichier</b><span>Accueil</span><span>Partage</span><span>Affichage</span></div>
      <div class="tb"><button class="nw">＋ Nouveau fichier</button></div>
      <div class="tb ex-addr"><button class="bk">←</button><button class="up">↑</button><div class="path"></div><input class="q" placeholder="Rechercher"></div>
      <div class="ex-main"><nav></nav><section></section></div><div class="ex-st"></div>`;
    const $$ = s => box.querySelector(s);
    let loc = 'Accès rapide', hist = [], q = '';
    const isF = l => F.some(f => f[0] === l);
    const el = (p, c, t) => { const e = document.createElement('div'); e.className = c; if (t !== undefined) e.textContent = t; p.appendChild(e); return e; };
    const go = (l, back) => { if (!back && l !== loc) hist.push(loc); loc = l; q = ''; $$('.q').value = ''; draw(); };
    const open = n => OS.open('notepad', n);
    const fileRow = (p, n, where) => {
      const r = el(p, 'row ex-f', '📄 ' + n); if (where) el(r, 'ex-w', where);
      r.ondblclick = () => open(n);
      r.oncontextmenu = e => { e.preventDefault(); OS.menu([['Ouvrir', () => open(n)], ['Supprimer', () => OS.fs.del(n)]], e.clientX, e.clientY); };
    };
    const tile = (p, [n, ic]) => { const t = el(p, 'ex-t'); t.innerHTML = `<i>${ic}</i><div>${n}<br><small>Ce PC</small></div>`; t.ondblclick = () => go(n); };
    function draw() {
      const nav = $$('nav'), main = $$('section'); nav.innerHTML = ''; main.innerHTML = '';
      [['Accès rapide', '⭐'], ['Ce PC', '💻'], ...F].forEach(([n, ic], i) => { el(nav, 'nv' + (i > 1 ? ' sub' : '') + (n === loc ? ' on' : ''), ic + ' ' + n).onclick = () => go(n); });
      $$('.path').textContent = isF(loc) ? 'Ce PC › ' + loc : loc;
      $$('.bk').disabled = !hist.length;
      const m = s => !q || s.toLowerCase().includes(q);
      let c = 0;
      if (loc === 'Accès rapide') {
        const fr = F.filter(f => ['Bureau', 'Téléchargements', 'Documents', 'Images'].includes(f[0]) && m(f[0]));
        el(main, 'ex-h', 'Dossiers fréquents (' + fr.length + ')'); const g = el(main, 'ex-g'); fr.forEach(f => tile(g, f));
        const rec = (OS.fs.d.r || []).filter(n => n in OS.fs.d.f && m(n));
        el(main, 'ex-h', 'Fichiers récents (' + rec.length + ')'); rec.forEach(n => fileRow(main, n, 'Ce PC\\Documents'));
        c = fr.length + rec.length;
      } else if (loc === 'Ce PC') {
        const fr = F.filter(f => m(f[0])); fr.forEach(f => 0); const g = el(main, 'ex-g'); fr.forEach(f => tile(g, f)); c = fr.length;
      } else if (loc === 'Documents') {
        const files = Object.keys(OS.fs.d.f).sort().filter(m); files.forEach(n => fileRow(main, n)); c = files.length;
      }
      if (!c) el(main, 'ex-e', 'Ce dossier est vide.');
      $$('.ex-st').textContent = c + ' élément(s)';
    }
    $$('.bk').onclick = () => { if (hist.length) go(hist.pop(), true); };
    $$('.up').onclick = () => go(isF(loc) ? 'Ce PC' : 'Accès rapide');
    $$('.nw').onclick = () => OS.open('notepad', '');
    $$('.q').oninput = e => { q = e.target.value.toLowerCase(); draw(); };
    OS.onFs(box, draw);
  }
});

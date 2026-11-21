OS.register({
  id: 'browser', name: 'Patate Explorer', icon: '🥔', w: 900, h: 560,
  render(box) {
    const SITES = [['📖', 'Wikipédia (FR)', 'https://fr.wikipedia.org'], ['📖', 'Wikipedia (EN)', 'https://en.wikipedia.org'],
      ['🧳', 'Wikivoyage', 'https://fr.wikivoyage.org'], ['🖼️', 'Wikimedia Commons', 'https://commons.wikimedia.org']];
    box.innerHTML = `<div class="bw-tabs"></div>
      <div class="tb bw-bar"><button class="bk">←</button><button class="fw">→</button><button class="rl">⟳</button><button class="hm">🏠</button><input class="ad" placeholder="Rechercher ou saisir une adresse"><button class="px" title="Proxy (pour les sites qui bloquent l’affichage)">🛡️</button><button class="ex" title="Ouvrir dans un vrai onglet">↗</button></div>
      <div class="bw-v"></div>
      <div class="ex-st">Google, YouTube et beaucoup d’autres sites refusent de s’afficher ici : utilise ↗ pour les ouvrir dans un vrai onglet.</div>`;
    const $$ = s => box.querySelector(s), bar = $$('.bw-tabs'), v = $$('.bw-v'), ad = $$('.ad');
    let tabs = [], cur = null;
    const norm = s => {
      s = (s || '').trim();
      if (!s) return '';
      if (/^https?:\/\//i.test(s)) return s;
      if (/^\S+\.[a-z]{2,}(\/\S*)?$/i.test(s)) return 'https://' + s;
      return 'https://fr.wikipedia.org/w/index.php?search=' + encodeURIComponent(s);   // Google/DDG bloquent l'affichage intégré
    };
    const draw = () => {
      bar.innerHTML = '';
      tabs.forEach(t => {
        const d = document.createElement('div'), u = t.h[t.i]; let n = 'Nouvel onglet';
        try { if (u) n = new URL(u).hostname; } catch (e) {}
        d.className = 'bw-t' + (t === cur ? ' on' : ''); d.textContent = n;
        const x = document.createElement('b'); x.textContent = '✕'; x.onclick = e => { e.stopPropagation(); close(t); };
        d.appendChild(x); d.onclick = () => { cur = t; draw(); }; bar.appendChild(d);
      });
      const p = document.createElement('button'); p.className = 'bw-p'; p.textContent = '+'; p.onclick = () => newTab(); bar.appendChild(p);
      tabs.forEach(t => { const u = t.h[t.i], on = t === cur; t.home.hidden = !(on && !u); t.frame.hidden = !(on && u); });
      ad.value = cur.h[cur.i]; $$('.bk').disabled = cur.i < 1; $$('.fw').disabled = cur.i >= cur.h.length - 1;
    };
    const proxy = () => st('sim-proxy', ''), useP = () => st('sim-proxyon', '') === '1';
    const load = t => { const u = t.h[t.i]; if (u) t.frame.src = proxy() && useP() ? proxy() + '?url=' + encodeURIComponent(u) : u; draw(); };
    const setP = () => {
      const u = (prompt('Adresse de ton proxy (voir proxy/worker.js)', proxy()) || '').trim();
      if (/^https:\/\//.test(u)) { sv('sim-proxy', u); sv('sim-proxyon', '1'); load(cur); }
    };
    const go = s => { cur.h = cur.h.slice(0, cur.i + 1); cur.h.push(norm(s)); cur.i++; load(cur); };
    const close = t => {
      const k = tabs.indexOf(t); t.home.remove(); t.frame.remove(); tabs.splice(k, 1);
      if (!tabs.length) return newTab();
      if (cur === t) cur = tabs[Math.min(k, tabs.length - 1)];
      draw();
    };
    const newTab = () => {
      const t = { h: [''], i: 0, frame: document.createElement('iframe'), home: document.createElement('div') };
      t.frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads');
      t.home.className = 'bw-home';
      t.home.innerHTML = '<h2>🥔 Patate Explorer</h2><input placeholder="Rechercher sur Wikipédia ou saisir une adresse"><div class="bw-g"></div>';
      const hi = t.home.querySelector('input'), g = t.home.querySelector('.bw-g');
      hi.onkeydown = e => { if (e.key === 'Enter') go(hi.value); };
      SITES.forEach(([ic, n, u]) => { const d = document.createElement('div'); d.className = 'st-t'; d.innerHTML = `<i>${ic}</i><div><b>${n}</b></div>`; d.onclick = () => go(u); g.appendChild(d); });
      v.append(t.home, t.frame); tabs.push(t); cur = t; draw(); hi.focus();
    };
    $$('.bk').onclick = () => { if (cur.i > 0) { cur.i--; load(cur); } };
    $$('.fw').onclick = () => { if (cur.i < cur.h.length - 1) { cur.i++; load(cur); } };
    $$('.rl').onclick = () => load(cur);
    $$('.hm').onclick = () => go('');
    $$('.px').onclick = e => {
      const r = e.currentTarget.getBoundingClientRect();
      OS.menu([[useP() ? 'Désactiver le proxy' : 'Activer le proxy', () => { if (!proxy()) return setP(); sv('sim-proxyon', useP() ? '0' : '1'); load(cur); }], ['Adresse du proxy…', setP]], r.left, r.bottom);
    };
    $$('.ex').onclick = () => { const u = cur.h[cur.i]; if (u) window.open(u, '_blank', 'noopener'); };
    ad.onkeydown = e => { if (e.key === 'Enter') go(ad.value); };
    newTab();
  }
});

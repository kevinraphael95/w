OS.register({
  id: 'browser', name: 'Patate Explorer', icon: '🥔', w: 900, h: 560,
  render(box) {
    const SITES = [['📖', 'Wikipédia (FR)', 'https://fr.wikipedia.org'], ['📖', 'Wikipedia (EN)', 'https://en.wikipedia.org'],
      ['🧳', 'Wikivoyage', 'https://fr.wikivoyage.org'], ['🖼️', 'Wikimedia Commons', 'https://commons.wikimedia.org']];
    box.innerHTML = `<div class="bw-tabs"></div>
      <div class="tb bw-bar"><button class="bk">←</button><button class="fw">→</button><button class="rl">⟳</button><button class="hm">🏠</button><input class="ad" placeholder="Rechercher ou saisir une adresse"><button class="px" title="Mode d’affichage (proxy)">🛡️</button><button class="ex" title="Ouvrir dans un vrai onglet">↗</button></div>
      <div class="bw-v"></div>
      <div class="ex-st">Wikipédia & GitHub Pages en direct, le reste via un proxy public (sans JavaScript : certains sites s’affichent mal). 🛡️ = mode, ↗ = vrai onglet.</div>`;
    const $$ = s => box.querySelector(s), bar = $$('.bw-tabs'), v = $$('.bw-v'), ad = $$('.ad');
    let tabs = [], cur = null;
    const norm = s => {
      s = (s || '').trim();
      if (!s) return '';
      if (/^https?:\/\//i.test(s)) return s;
      if (/^\S+\.[a-z]{2,}(\/\S*)?$/i.test(s)) return 'https://' + s;
      return (mode() === 'off' ? 'https://fr.wikipedia.org/w/index.php?search=' : 'https://html.duckduckgo.com/html/?q=') + encodeURIComponent(s);
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
    const mode = () => st('sim-pmode', 'auto');   // auto | on | off
    // proxys publics gratuits (essayés dans l'ordre) : ils renvoient le HTML de la page, qu'on affiche dans le cadre
    const PROX = ['https://api.allorigins.win/raw?url=', 'https://corsproxy.io/?url=', 'https://api.codetabs.com/v1/proxy?quest='];
    const SB_D = 'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads', SB_P = 'allow-scripts allow-forms allow-popups';
    const direct = u => { try { return /(^|\.)(wiki[a-z]*|wikimedia)\.org$|\.github\.io$/i.test(new URL(u).hostname); } catch (e) { return true; } };
    const msg = t => `<p style="font:14px sans-serif;padding:24px">${t}</p>`;
    const fetchHtml = async u => {
      for (const p of PROX) {
        try { const r = await fetch(p + encodeURIComponent(u), { signal: AbortSignal.timeout(9000) }); if (r.ok) { const h = await r.text(); if (h.length > 50) return h; } } catch (e) {}
      }
      throw new Error('proxy');
    };
    const prep = (h, u) => {
      h = h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<meta[^>]+http-equiv=["']?refresh[^>]*>/gi, '');
      const inj = `<base href="${u.replace(/"/g, '%22')}"><script>
        addEventListener('click',e=>{const a=e.target.closest('a[href]');if(a&&/^https?:/.test(a.href)){e.preventDefault();parent.postMessage({bw:a.href},'*')}},true);
        addEventListener('submit',e=>{const f=e.target;if((f.method||'get').toLowerCase()==='get'){e.preventDefault();const a=new URL(f.action);parent.postMessage({bw:a.origin+a.pathname+'?'+new URLSearchParams(new FormData(f))},'*')}},true)<\/script>`;
      return /<head[^>]*>/i.test(h) ? h.replace(/<head[^>]*>/i, m => m + inj) : inj + h;
    };
    const load = async t => {
      const u = t.h[t.i], k = ++t.n; draw();
      if (!u) return;
      if (mode() === 'off' || (mode() === 'auto' && direct(u))) { t.frame.removeAttribute('srcdoc'); t.frame.setAttribute('sandbox', SB_D); t.frame.src = u; return; }
      t.frame.setAttribute('sandbox', SB_P); t.frame.srcdoc = msg('Chargement…');
      try { const h = await fetchHtml(u); if (k === t.n) t.frame.srcdoc = prep(h, u); }
      catch (e) { if (k === t.n) t.frame.srcdoc = msg('Impossible de charger cette page via le proxy public (site bloqué ou proxy indisponible). Utilise ↗ pour l’ouvrir dans un vrai onglet.'); }
    };
    const go = s => { cur.h = cur.h.slice(0, cur.i + 1); cur.h.push(norm(s)); cur.i++; load(cur); };
    const close = t => {
      const k = tabs.indexOf(t); t.home.remove(); t.frame.remove(); tabs.splice(k, 1);
      if (!tabs.length) return newTab();
      if (cur === t) cur = tabs[Math.min(k, tabs.length - 1)];
      draw();
    };
    const newTab = () => {
      const t = { h: [''], i: 0, n: 0, frame: document.createElement('iframe'), home: document.createElement('div') };
      t.frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads');
      t.home.className = 'bw-home';
      t.home.innerHTML = '<h2>🥔 Patate Explorer</h2><input placeholder="Rechercher sur le web ou saisir une adresse"><div class="bw-g"></div>';
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
      const r = e.currentTarget.getBoundingClientRect(), set = m => () => { sv('sim-pmode', m); load(cur); };
      OS.menu([['Auto : sites compatibles en direct, le reste via proxy' + (mode() === 'auto' ? ' ✓' : ''), set('auto')], ['Toujours via le proxy' + (mode() === 'on' ? ' ✓' : ''), set('on')], ['Jamais de proxy' + (mode() === 'off' ? ' ✓' : ''), set('off')]], r.left, r.bottom);
    };
    $$('.ex').onclick = () => { const u = cur.h[cur.i]; if (u) window.open(u, '_blank', 'noopener'); };
    ad.onkeydown = e => { if (e.key === 'Enter') go(ad.value); };
    const onMsg = e => {
      if (!box.isConnected) return removeEventListener('message', onMsg);
      const t = tabs.find(x => x.frame.contentWindow === e.source), u = e.data && e.data.bw;
      if (t && typeof u === 'string' && /^https?:\/\//i.test(u)) { cur = t; go(u); }   // clic sur un lien dans une page proxifiée
    };
    addEventListener('message', onMsg);
    newTab();
  }
});

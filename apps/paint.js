OS.register({
  id: 'paint', name: 'Paint', icon: '🎨', w: 960, h: 640,
  render(box) {
    const COL = ['#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
      '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'];
    const A = [[0, .3], [.6, .3], [.6, 0], [1, .5], [.6, 1], [.6, .7], [0, .7]];
    const star = (n, ri) => [...Array(2 * n)].map((_, k) => { const r = k % 2 ? ri : .5, a = Math.PI * k / n; return [.5 + r * Math.sin(a), .5 - r * Math.cos(a)]; });
    // formes : 'l' ligne, 'e' ellipse, 'r' rectangle, 'q' rectangle arrondi, sinon liste de points (0..1)
    const SH = { line: 'l', ell: 'e', rect: 'r', rrect: 'q', tri: [[.5, 0], [1, 1], [0, 1]], rtri: [[0, 0], [1, 1], [0, 1]], dia: [[.5, 0], [1, .5], [.5, 1], [0, .5]],
      pent: [[.5, 0], [1, .38], [.81, 1], [.19, 1], [0, .38]], hex: [[.25, 0], [.75, 0], [1, .5], [.75, 1], [.25, 1], [0, .5]],
      arR: A, arL: A.map(([x, y]) => [1 - x, y]), arU: A.map(([x, y]) => [y, 1 - x]), arD: A.map(([x, y]) => [y, x]), st4: star(4, .15), st5: star(5, .2), st6: star(6, .25) };
    const ico = s => {
      const p = SH[s], st = 'fill="none" stroke="#1e6fc2" stroke-width=".07"';
      const g = p === 'l' ? `<path d="M0 0L1 1" ${st}/>` : p === 'e' ? `<ellipse cx=".5" cy=".5" rx=".5" ry=".4" ${st}/>` : p === 'r' ? `<rect y=".1" width="1" height=".8" ${st}/>`
        : p === 'q' ? `<rect y=".1" width="1" height=".8" rx=".2" ${st}/>` : `<polygon points="${p.map(q => q.join(',')).join(' ')}" ${st}/>`;
      return `<svg viewBox="-.05 -.05 1.1 1.1" width="18" height="18">${g}</svg>`;
    };
    const T = (t, ic, n) => `<button data-t="${t}" title="${n}">${ic}</button>`;
    box.tabIndex = 0; box.style.outline = '0'; box.style.background = '#fff';
    box.innerHTML = `<div class="pn-tabs"><span class="pn-qa"><button data-a="save" title="Enregistrer">💾</button><button data-a="undo" title="Annuler">↶</button><button data-a="redo" title="Rétablir">↷</button></span><span class="pn-tab f" data-a="file">Fichier</span><span class="pn-tab on">Accueil</span><span class="pn-tab">Affichage</span></div>
    <div class="pn-rb">
      <div class="pn-g"><div class="pn-gb"><button class="pn-big" data-a="paste"><i>📋</i>Coller</button><div class="pn-col"><button data-a="cut">✂ Couper</button><button data-a="copy">⧉ Copier</button></div></div><label>Presse-papiers</label></div>
      <div class="pn-g"><div class="pn-gb"><button class="pn-big" data-t="select"><i>⬚</i>Sélectionner</button><div class="pn-col"><button data-a="crop">⛶ Rogner</button><button data-a="resize">⤡ Redimensionner</button><button data-a="rotate">⟳ Faire pivoter ▾</button></div></div><label>Image</label></div>
      <div class="pn-g"><div class="pn-gb"><div class="pn-grid" style="grid-template-columns:repeat(3,26px)">${T('pencil', '✏️', 'Crayon')}${T('fill', '💧', 'Remplissage')}${T('text', '<b style="font-family:serif">A</b>', 'Texte')}${T('eraser', '🧽', 'Gomme')}${T('pick', '💉', 'Pipette')}${T('zoom', '🔍', 'Loupe')}</div>
        <button class="pn-big on" data-t="brush"><i>🖌️</i>Pinceaux</button></div><label>Outils</label></div>
      <div class="pn-g"><div class="pn-gb"><div class="pn-grid" style="grid-template-columns:repeat(8,24px)">${Object.keys(SH).map(k => T(k, ico(k), k)).join('')}</div>
        <div class="pn-col"><button data-a="outline">✎ Contour ▾</button><button data-a="fillm">▧ Remplissage ▾</button></div></div><label>Formes</label></div>
      <div class="pn-g"><div class="pn-gb"><button class="pn-big" data-a="size"><i>☰</i>Taille ▾</button></div></div>
      <div class="pn-g"><div class="pn-gb"><button class="pn-big sl" data-c="1"><b class="pn-cb c1"></b>Couleur 1</button><button class="pn-big" data-c="2"><b class="pn-cb c2"></b>Couleur 2</button><div class="pn-pal"></div>
        <button class="pn-big pn-mc" data-a="mc"><i></i>Modifier les couleurs</button></div><label>Couleurs</label></div>
    </div>
    <div class="pn-wrap"><div></div><div class="pn-rh"><div class="pn-ri"></div></div><div class="pn-rv"><div class="pn-ri"></div></div>
      <div class="pn-sc"><div class="pn-cw"><canvas></canvas><div class="pn-sel" hidden></div></div></div></div>
    <div class="pn-st"><span class="ps">✛</span><span class="pz"></span><span class="pn-zm"><b class="zl">100 %</b><button data-a="zout">−</button><input type="range" class="zs" min="10" max="400" value="100"><button data-a="zin">+</button></span></div>`;
    const $$ = s => box.querySelector(s), cv = $$('canvas'), cx = cv.getContext('2d', { willReadFrequently: true }), cw = $$('.pn-cw'), so = $$('.pn-sel');
    let tool = 'brush', c1 = '#000000', c2 = '#ffffff', cs = 1, size = 3, z = 1, un = [], re = [], sel = null, clip = null, fillMode = false, outline = true, customs = [];
    const menu = (items, el) => { const r = el.getBoundingClientRect(); OS.menu(items, r.left, r.bottom); };
    const rulers = () => {
      let h = '', v = '';
      for (let i = 0; i <= 45; i++) { h += `<span style="left:${i * 100 * z}px">${i * 100}</span>`; v += `<span style="top:${i * 100 * z}px">${i * 100}</span>`; }
      const H = $$('.pn-rh .pn-ri'), V = $$('.pn-rv .pn-ri'); H.innerHTML = h; V.innerHTML = v;
      H.style.background = `linear-gradient(90deg,#999 1px,transparent 1px) 0 100%/${10 * z}px 5px repeat-x`;
      V.style.background = `linear-gradient(180deg,#999 1px,transparent 1px) 100% 0/5px ${10 * z}px repeat-y`;
    };
    const info = () => { cv.style.width = cv.width * z + 'px'; cv.style.height = cv.height * z + 'px'; $$('.pz').textContent = '▢ ' + cv.width + ' × ' + cv.height + 'px'; };
    const showSel = () => { if (!sel) { so.hidden = true; return; } so.hidden = false; so.style.cssText = `left:${sel.x * z}px;top:${sel.y * z}px;width:${sel.w * z}px;height:${sel.h * z}px`; };
    const zoom = v => { z = Math.max(.1, Math.min(4, v)); $$('.zl').textContent = Math.round(z * 100) + ' %'; $$('.zs').value = Math.round(z * 100); info(); rulers(); showSel(); };
    const blank = (w, h) => { cv.width = w; cv.height = h; cx.fillStyle = '#fff'; cx.fillRect(0, 0, w, h); info(); };
    const snap = () => { un.push(cx.getImageData(0, 0, cv.width, cv.height)); if (un.length > 30) un.shift(); re = []; };
    const swap = (a, b) => { if (!a.length) return; b.push(cx.getImageData(0, 0, cv.width, cv.height)); const d = a.pop(); cv.width = d.width; cv.height = d.height; cx.putImageData(d, 0, 0); info(); };
    const resizeTo = (W, H) => { if (W < 1 || H < 1 || W > 4000 || H > 4000) return; snap(); const d = cx.getImageData(0, 0, cv.width, cv.height); blank(W, H); cx.putImageData(d, 0, 0); };
    const paintC = () => { $$('.c1').style.background = c1; $$('.c2').style.background = c2; };
    const setC = (c, s) => { if (s === 2) c2 = c; else c1 = c; paintC(); };
    const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
    const hex = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16));
    const fill = (x, y, col) => {
      const w = cv.width, h = cv.height, im = cx.getImageData(0, 0, w, h), d = im.data, n = hex(col);
      x |= 0; y |= 0;
      const i0 = (y * w + x) * 4, t = [d[i0], d[i0 + 1], d[i0 + 2], d[i0 + 3]];
      if (t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === 255) return;
      const same = i => d[i] === t[0] && d[i + 1] === t[1] && d[i + 2] === t[2] && d[i + 3] === t[3];
      const st = [[x, y]];
      while (st.length) {
        let [px, py] = st.pop(), up = false, dn = false;
        while (px >= 0 && same((py * w + px) * 4)) px--;
        px++;
        while (px < w && same((py * w + px) * 4)) {
          const j = (py * w + px) * 4; d[j] = n[0]; d[j + 1] = n[1]; d[j + 2] = n[2]; d[j + 3] = 255;
          if (py > 0) { const s = same(((py - 1) * w + px) * 4); if (s && !up) st.push([px, py - 1]); up = s; }
          if (py < h - 1) { const s = same(((py + 1) * w + px) * 4); if (s && !dn) st.push([px, py + 1]); dn = s; }
          px++;
        }
      }
      cx.putImageData(im, 0, 0);
    };
    const shape = (s, a, b, stroke, fc) => {
      const x = Math.min(a[0], b[0]), y = Math.min(a[1], b[1]), w = Math.abs(b[0] - a[0]), h = Math.abs(b[1] - a[1]), p = SH[s];
      cx.beginPath();
      if (p === 'l') { cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); }
      else if (p === 'e') cx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 7);
      else if (p === 'r') cx.rect(x, y, w, h);
      else if (p === 'q') cx.roundRect ? cx.roundRect(x, y, w, h, Math.min(w, h) / 5) : cx.rect(x, y, w, h);
      else { p.forEach(([u, v], i) => cx[i ? 'lineTo' : 'moveTo'](x + u * w, y + v * h)); cx.closePath(); }
      if (fillMode && p !== 'l') { cx.fillStyle = fc; cx.fill(); }
      if (outline || p === 'l') { cx.strokeStyle = stroke; cx.stroke(); }
    };
    const xf = k => {
      snap(); const w = cv.width, h = cv.height, t = document.createElement('canvas'); t.width = w; t.height = h; t.getContext('2d').drawImage(cv, 0, 0);
      const r = k === 'r' || k === 'l'; cv.width = r ? h : w; cv.height = r ? w : h;
      cx.setTransform(...{ r: [0, 1, -1, 0, h, 0], l: [0, -1, 1, 0, 0, w], '180': [-1, 0, 0, -1, w, h], fh: [-1, 0, 0, 1, w, 0], fv: [1, 0, 0, -1, 0, h] }[k]);
      cx.drawImage(t, 0, 0); cx.setTransform(1, 0, 0, 1, 0, 0); info();
    };
    const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*';
    fi.onchange = () => {
      const f = fi.files[0]; if (!f) return;
      const im = new Image();
      im.onload = () => { snap(); cv.width = im.width; cv.height = im.height; cx.drawImage(im, 0, 0); info(); URL.revokeObjectURL(im.src); };
      im.src = URL.createObjectURL(f); fi.value = '';
    };
    const ci = document.createElement('input'); ci.type = 'color';
    ci.onchange = () => { customs.unshift(ci.value); customs = customs.slice(0, 10); setC(ci.value, cs); drawPal(); };
    const dims = () => {
      const m = (prompt('Largeur x hauteur', cv.width + 'x' + cv.height) || '').match(/^(\d{1,4})\s*[x×]\s*(\d{1,4})$/);
      if (m) resizeTo(+m[1], +m[2]);
    };
    const act = {
      save: () => cv.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'image.png'; a.click(); }),
      undo: () => swap(un, re), redo: () => swap(re, un),
      file: b => menu([['Nouveau', () => { snap(); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); sel = null; showSel(); }], ['Ouvrir…', () => fi.click()], ['Enregistrer sous (PNG)', act.save], ['Dimensions de la zone…', dims]], b),
      copy: () => { if (sel) clip = cx.getImageData(sel.x, sel.y, sel.w, sel.h); },
      cut: () => { if (!sel) return; act.copy(); snap(); cx.fillStyle = c2; cx.fillRect(sel.x, sel.y, sel.w, sel.h); },
      paste: () => { if (!clip) return; snap(); const x = sel ? sel.x : 0, y = sel ? sel.y : 0; cx.putImageData(clip, x, y); sel = { x, y, w: clip.width, h: clip.height }; showSel(); },
      crop: () => { if (!sel) return; snap(); const d = cx.getImageData(sel.x, sel.y, sel.w, sel.h); cv.width = sel.w; cv.height = sel.h; cx.putImageData(d, 0, 0); sel = null; showSel(); info(); },
      resize: () => {
        const s = (prompt('Redimensionner : pourcentage (ex. 50) ou LxH (ex. 800x600)', 100) || '').trim(), m = s.match(/^(\d{1,4})\s*[x×]\s*(\d{1,4})$/);
        let W, H;
        if (m) { W = +m[1]; H = +m[2]; } else if (/^\d{1,4}%?$/.test(s)) { W = Math.round(cv.width * parseInt(s) / 100); H = Math.round(cv.height * parseInt(s) / 100); } else return;
        if (W < 1 || H < 1 || W > 4000 || H > 4000) return;
        snap(); const t = document.createElement('canvas'); t.width = cv.width; t.height = cv.height; t.getContext('2d').drawImage(cv, 0, 0);
        cv.width = W; cv.height = H; cx.drawImage(t, 0, 0, W, H); info();
      },
      rotate: b => menu([['Pivoter à droite de 90°', () => xf('r')], ['Pivoter à gauche de 90°', () => xf('l')], ['Pivoter de 180°', () => xf('180')], ['Retourner verticalement', () => xf('fv')], ['Retourner horizontalement', () => xf('fh')]], b),
      outline: b => menu([['Contour uni', () => outline = true], ['Sans contour', () => outline = false]], b),
      fillm: b => menu([['Sans remplissage', () => fillMode = false], ['Couleur unie', () => fillMode = true]], b),
      size: b => menu([1, 3, 5, 8, 12].map(n => [n + ' px' + (n === size ? ' ✓' : ''), () => size = n]), b),
      mc: () => ci.click(),
      zin: () => zoom(z + .1), zout: () => zoom(z - .1)
    };
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-a],[data-t],[data-c]'); if (!b || !box.contains(b)) return;
      if (b.dataset.t) { tool = b.dataset.t; box.querySelectorAll('[data-t]').forEach(x => x.classList.toggle('on', x === b)); }
      else if (b.dataset.c) { cs = +b.dataset.c; box.querySelectorAll('[data-c]').forEach(x => x.classList.toggle('sl', x === b)); }
      else if (act[b.dataset.a]) act[b.dataset.a](b);
    });
    $$('.zs').oninput = e => zoom(e.target.value / 100);

    const pal = $$('.pn-pal');
    const drawPal = () => {
      pal.innerHTML = '';
      for (let i = 0; i < 30; i++) {
        const c = i < 20 ? COL[i] : customs[i - 20], d = document.createElement('div');
        if (c) { d.style.background = c; d.onclick = () => setC(c, cs); d.oncontextmenu = e => { e.preventDefault(); setC(c, 2); }; }
        pal.appendChild(d);
      }
    };
    drawPal(); paintC(); blank(900, 520); rulers();
    const sc = $$('.pn-sc');
    sc.onscroll = () => { $$('.pn-rh .pn-ri').style.transform = `translateX(${-sc.scrollLeft}px)`; $$('.pn-rv .pn-ri').style.transform = `translateY(${-sc.scrollTop}px)`; };
    [['r', 1, 0], ['b', 0, 1], ['rb', 1, 1]].forEach(([c, mx, my]) => {
      const h = document.createElement('div'); h.className = 'pn-h ' + c; cw.appendChild(h);
      h.onpointerdown = e => {
        h.setPointerCapture(e.pointerId);
        const sx = e.clientX, sy = e.clientY, w0 = cv.width, h0 = cv.height;
        const dim = m => [Math.max(1, Math.round(w0 + mx * (m.clientX - sx) / z)), Math.max(1, Math.round(h0 + my * (m.clientY - sy) / z))];
        h.onpointermove = m => { const d = dim(m); $$('.pz').textContent = '▢ ' + d[0] + ' × ' + d[1] + 'px'; };
        h.onpointerup = m => { h.onpointermove = h.onpointerup = null; resizeTo(...dim(m)); };
      };
    });

    cv.oncontextmenu = e => e.preventDefault();
    cv.addEventListener('pointermove', e => { const p = pt(e); $$('.ps').textContent = '✛ ' + Math.round(p[0]) + ', ' + Math.round(p[1]) + 'px'; });
    cv.onpointerdown = e => {
      if (e.button > 2) return;
      box.focus();
      const col = e.button === 2 ? c2 : c1, alt = e.button === 2 ? c1 : c2, a = pt(e);
      if (tool === 'zoom') { zoom(z * (e.button === 2 ? 1 / 1.5 : 1.5)); return; }
      if (tool === 'pick') { const p = cx.getImageData(a[0], a[1], 1, 1).data; setC('#' + [p[0], p[1], p[2]].map(v => v.toString(16).padStart(2, '0')).join(''), e.button === 2 ? 2 : cs); return; }
      if (tool === 'select') {
        cv.setPointerCapture(e.pointerId); sel = null; showSel();
        cv.onpointermove = m => {
          const b = pt(m), x = Math.max(0, Math.min(a[0], b[0])) | 0, y = Math.max(0, Math.min(a[1], b[1])) | 0;
          sel = { x, y, w: Math.min(cv.width, Math.max(a[0], b[0])) - x | 0, h: Math.min(cv.height, Math.max(a[1], b[1])) - y | 0 }; showSel();
        };
        cv.onpointerup = () => { cv.onpointermove = cv.onpointerup = null; if (sel && (sel.w < 2 || sel.h < 2)) { sel = null; showSel(); } };
        return;
      }
      snap();
      if (tool === 'fill') return fill(a[0], a[1], col);
      if (tool === 'text') {
        const t = prompt('Texte :');
        if (t) { cx.fillStyle = col; cx.font = (12 + size * 2) + 'px "Segoe UI",sans-serif'; cx.textBaseline = 'top'; cx.fillText(t, a[0], a[1]); }
        return;
      }
      cv.setPointerCapture(e.pointerId);
      const free = ['pencil', 'brush', 'eraser'].includes(tool), base = free ? null : cx.getImageData(0, 0, cv.width, cv.height);
      cx.lineCap = cx.lineJoin = 'round'; cx.strokeStyle = tool === 'eraser' ? alt : col;
      cx.lineWidth = tool === 'pencil' ? 1 : tool === 'eraser' ? size * 3 : size;
      let last = a;
      if (free) { cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(a[0] + .01, a[1]); cx.stroke(); }
      cv.onpointermove = m => {
        const b = pt(m);
        if (free) { cx.beginPath(); cx.moveTo(last[0], last[1]); cx.lineTo(b[0], b[1]); cx.stroke(); last = b; return; }
        cx.putImageData(base, 0, 0); shape(tool, a, b, col, alt);
      };
      cv.onpointerup = () => { cv.onpointermove = cv.onpointerup = null; };
    };
    box.onkeydown = e => {
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); act.undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); act.redo(); }
      if (e.ctrlKey && e.key === 'c') act.copy();
      if (e.ctrlKey && e.key === 'x') act.cut();
      if (e.ctrlKey && e.key === 'v') act.paste();
    };
  }
});

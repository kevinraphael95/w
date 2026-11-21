OS.register({
  id: 'paint', name: 'Paint', icon: '🎨', w: 880, h: 580,
  render(box) {
    const COL = ['#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
      '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'];
    const TOOLS = [['pencil', '✏️', 'Crayon'], ['brush', '🖌️', 'Pinceau'], ['eraser', '🧽', 'Gomme'], ['fill', '💧', 'Remplir'], ['pick', '💉', 'Pipette'],
      ['text', '🅰️', 'Texte'], ['line', '╱', 'Ligne'], ['rect', '▭', 'Rectangle'], ['ellipse', '◯', 'Ellipse']];
    box.tabIndex = 0; box.style.outline = '0';
    box.innerHTML = `<div class="ex-tabs"><b>Fichier</b><span>Accueil</span><span>Affichage</span></div>
      <div class="tb pt-rb"><button class="nw">Nouveau</button><button class="op">Ouvrir…</button><button class="sv">Enregistrer</button><button class="rs">Dimensions…</button><i class="pt-sep"></i>
      <button class="un">↶ Annuler</button><button class="re">↷ Rétablir</button><i class="pt-sep"></i><div class="tl"></div><i class="pt-sep"></i>
      <label>Taille <select class="sz"></select></label><i class="pt-sep"></i><div class="pt-c c1" title="Couleur 1"></div><div class="pt-c c2" title="Couleur 2"></div><div class="pt-pal"></div></div>
      <div class="pt-w"><canvas></canvas></div><div class="ex-st pt-s"><span class="ps"></span><span class="pz"></span></div>`;
    const $$ = s => box.querySelector(s), cv = $$('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
    let tool = 'pencil', c1 = '#000000', c2 = '#ffffff', size = 3, un = [], re = [];
    const info = () => { $$('.pz').textContent = cv.width + ' × ' + cv.height + 'px'; };
    const blank = (w, h) => { cv.width = w; cv.height = h; cx.fillStyle = '#fff'; cx.fillRect(0, 0, w, h); info(); };
    const snap = () => { un.push(cx.getImageData(0, 0, cv.width, cv.height)); if (un.length > 30) un.shift(); re = []; };
    const swap = (a, b) => { if (!a.length) return; b.push(cx.getImageData(0, 0, cv.width, cv.height)); const d = a.pop(); cv.width = d.width; cv.height = d.height; cx.putImageData(d, 0, 0); info(); };
    const paint = () => { $$('.c1').style.background = c1; $$('.c2').style.background = c2; };
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
    blank(800, 500); paint();

    TOOLS.forEach(([id, ic, n]) => {
      const b = document.createElement('button'); b.textContent = ic; b.title = n;
      b.onclick = () => { tool = id; [...$$('.tl').children].forEach(x => x.classList.toggle('on', x === b)); };
      if (id === tool) b.classList.add('on');
      $$('.tl').appendChild(b);
    });
    COL.forEach(c => {
      const s = document.createElement('div'); s.style.background = c;
      s.onclick = () => { c1 = c; paint(); };
      s.oncontextmenu = e => { e.preventDefault(); c2 = c; paint(); };
      $$('.pt-pal').appendChild(s);
    });
    const sz = $$('.sz'); [1, 2, 3, 5, 8, 12, 20, 30].forEach(n => sz.add(new Option(n + ' px', n))); sz.value = 3;
    sz.onchange = () => { size = +sz.value; };

    cv.oncontextmenu = e => e.preventDefault();
    cv.addEventListener('pointermove', e => { const p = pt(e); $$('.ps').textContent = Math.round(p[0]) + ', ' + Math.round(p[1]) + 'px'; });
    cv.onpointerdown = e => {
      if (e.button > 2) return;
      box.focus();
      const col = e.button === 2 ? c2 : c1, a = pt(e);
      if (tool === 'pick') {
        const p = cx.getImageData(a[0], a[1], 1, 1).data;
        const h = '#' + [p[0], p[1], p[2]].map(v => v.toString(16).padStart(2, '0')).join('');
        if (e.button === 2) c2 = h; else c1 = h;
        paint(); return;
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
      cx.lineCap = cx.lineJoin = 'round'; cx.strokeStyle = tool === 'eraser' ? c2 : col;
      cx.lineWidth = tool === 'pencil' ? 1 : tool === 'eraser' ? size * 3 : size;
      let last = a;
      if (free) { cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(a[0] + .01, a[1]); cx.stroke(); }
      cv.onpointermove = m => {
        const b = pt(m);
        if (free) { cx.beginPath(); cx.moveTo(last[0], last[1]); cx.lineTo(b[0], b[1]); cx.stroke(); last = b; return; }
        cx.putImageData(base, 0, 0); cx.beginPath();
        if (tool === 'line') { cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); }
        else if (tool === 'rect') cx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
        else cx.ellipse((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.abs(b[0] - a[0]) / 2, Math.abs(b[1] - a[1]) / 2, 0, 0, 7);
        cx.stroke();
      };
      cv.onpointerup = () => { cv.onpointermove = cv.onpointerup = null; };
    };

    $$('.nw').onclick = () => { snap(); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); };
    $$('.un').onclick = () => swap(un, re);
    $$('.re').onclick = () => swap(re, un);
    $$('.sv').onclick = () => cv.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'image.png'; a.click(); });
    $$('.rs').onclick = () => {
      const m = (prompt('Largeur x hauteur', cv.width + 'x' + cv.height) || '').match(/^(\d{1,4})\s*[x×]\s*(\d{1,4})$/);
      if (!m) return;
      snap(); const d = cx.getImageData(0, 0, cv.width, cv.height); blank(+m[1], +m[2]); cx.putImageData(d, 0, 0);
    };
    const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*';
    fi.onchange = () => {
      const f = fi.files[0]; if (!f) return;
      const im = new Image();
      im.onload = () => { snap(); cv.width = im.width; cv.height = im.height; cx.drawImage(im, 0, 0); info(); URL.revokeObjectURL(im.src); };
      im.src = URL.createObjectURL(f); fi.value = '';
    };
    $$('.op').onclick = () => fi.click();
    box.onkeydown = e => {
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); swap(un, re); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); swap(re, un); }
    };
  }
});

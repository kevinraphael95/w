OS.register({
  id: 'paint', name: 'Paint', icon: '🎨', w: 700, h: 520,
  render(box) {
    box.innerHTML = `<div class="tb"><input type="color" class="c" value="#000000" title="Couleur"><input type="range" class="s" min="1" max="40" value="4" title="Taille">
      <button data-t="p">Crayon</button><button data-t="e">Gomme</button><button data-t="l">Ligne</button><button data-t="r">Rectangle</button>
      <button class="n">Nouveau</button><button class="d">Enregistrer PNG</button></div>
      <div style="flex:1;overflow:auto;background:#999;padding:8px"><canvas width="800" height="500" style="background:#fff;touch-action:none;cursor:crosshair"></canvas></div>`;
    const q = s => box.querySelector(s), cv = q('canvas'), x = cv.getContext('2d');
    let tool = 'p', on = false, a, snap;
    const blank = () => { x.fillStyle = '#fff'; x.fillRect(0, 0, 800, 500); };
    blank(); x.lineCap = x.lineJoin = 'round';
    const pick = t => box.querySelectorAll('[data-t]').forEach(b => b.style.background = b.dataset.t === t ? '#cce8ff' : '');
    box.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { tool = b.dataset.t; pick(tool); });
    pick(tool);
    const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 800 / r.width, (e.clientY - r.top) * 500 / r.height]; };
    cv.onpointerdown = e => {
      on = true; cv.setPointerCapture(e.pointerId); a = pt(e); snap = x.getImageData(0, 0, 800, 500);
      x.strokeStyle = tool === 'e' ? '#fff' : q('.c').value; x.lineWidth = +q('.s').value;
      x.beginPath(); x.moveTo(...a); x.lineTo(a[0] + .01, a[1]); x.stroke();
    };
    cv.onpointermove = e => {
      if (!on) return;
      const b = pt(e);
      if (tool === 'p' || tool === 'e') { x.lineTo(...b); x.stroke(); return; }
      x.putImageData(snap, 0, 0); x.beginPath();
      if (tool === 'l') { x.moveTo(...a); x.lineTo(...b); } else x.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
      x.stroke();
    };
    cv.onpointerup = () => { on = false; };
    q('.n').onclick = () => { if (confirm('Effacer le dessin ?')) blank(); };
    q('.d').onclick = () => { const l = document.createElement('a'); l.href = cv.toDataURL('image/png'); l.download = 'dessin.png'; l.click(); };
  }
});

OS.register({
  id: 'calc', name: 'Calculatrice', icon: '🧮', w: 260, h: 380,
  render(box) {
    box.style.background = '#f0f0f0';
    box.innerHTML = '<div class="d" style="padding:14px 10px;text-align:right;font-size:32px;background:#fff;min-height:64px;overflow:hidden">0</div><div class="g" style="flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:2px"></div>';
    const d = box.querySelector('.d'), g = box.querySelector('.g');
    let s = '';
    const show = () => d.textContent = s || '0';
    'C ⌫ % / 7 8 9 * 4 5 6 - 1 2 3 + ± 0 . ='.split(' ').forEach(k => {
      const b = document.createElement('button');
      b.textContent = k; b.style.cssText = 'border:0;background:#fafafa;font-size:18px;cursor:pointer';
      b.onclick = () => {
        if (k === 'C') s = '';
        else if (k === '⌫') s = s.slice(0, -1);
        else if (k === '±') s = s.startsWith('-') ? s.slice(1) : s && '-' + s;
        else if (k === '=') { try { if (/^[\d+\-*/%.() ]+$/.test(s)) s = String(Function('return ' + s)()); } catch (e) { s = ''; } }
        else s += k;
        show();
      };
      g.appendChild(b);
    });
  }
});

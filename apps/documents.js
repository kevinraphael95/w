OS.register({
  id: 'documents', name: 'Documents', icon: '📁', w: 500, h: 350,
  render(box) {
    box.innerHTML = '<div class="tb"><button class="n">＋ Nouveau</button><span>Double-clic : ouvrir · clic droit : options</span></div><div class="ls" style="flex:1;overflow:auto;background:#fff"></div>';
    const ls = box.querySelector('.ls');
    box.querySelector('.n').onclick = () => OS.open('notepad', '');
    OS.onFs(box, () => {
      ls.innerHTML = '';
      const names = Object.keys(OS.fs.d.f).sort();
      if (!names.length) ls.innerHTML = '<p style="color:#999;text-align:center">Dossier vide.</p>';
      names.forEach(n => {
        const r = document.createElement('div'); r.className = 'row'; r.textContent = '📄 ' + n;
        r.ondblclick = () => OS.open('notepad', n);
        r.oncontextmenu = e => { e.preventDefault(); OS.menu([['Ouvrir', () => OS.open('notepad', n)], ['Supprimer', () => OS.fs.del(n)]], e.clientX, e.clientY); };
        ls.appendChild(r);
      });
    });
  }
});

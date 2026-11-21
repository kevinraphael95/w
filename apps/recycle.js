OS.register({
  id: 'recycle', name: 'Corbeille', icon: '🗑️', w: 400, h: 300,
  render(box) {
    box.innerHTML = '<div class="tb"><button class="e">Vider la corbeille</button><span>Double-clic : restaurer</span></div><div class="ls" style="flex:1;overflow:auto;background:#fafafa"></div>';
    const ls = box.querySelector('.ls');
    box.querySelector('.e').onclick = () => { OS.fs.d.t = {}; OS.fs.save(); };
    OS.onFs(box, () => {
      ls.innerHTML = '';
      const names = Object.keys(OS.fs.d.t).sort();
      if (!names.length) ls.innerHTML = '<p style="color:#999;text-align:center">La corbeille est vide.</p>';
      names.forEach(n => {
        const r = document.createElement('div'); r.className = 'row'; r.textContent = '📄 ' + n;
        r.ondblclick = () => OS.fs.restore(n);
        r.oncontextmenu = e => { e.preventDefault(); OS.menu([['Restaurer', () => OS.fs.restore(n)], ['Supprimer définitivement', () => OS.fs.purge(n)]], e.clientX, e.clientY); };
        ls.appendChild(r);
      });
    });
  }
});

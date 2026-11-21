OS.register({
  id: 'notepad', name: 'Bloc-notes', icon: '📝', w: 520, h: 360,
  render(box, win, arg) {
    box.innerHTML = '<div class="tb"><button class="n">Nouveau</button><button class="s">Enregistrer sous…</button><span class="f"></span></div><textarea style="flex:1;border:0;outline:0;resize:none;padding:8px;font:14px Consolas,monospace"></textarea>';
    const t = box.querySelector('textarea'), f = box.querySelector('.f');
    let cur = null;
    const load = n => { cur = n; t.value = n ? OS.fs.d.f[n] ?? '' : st('sim-notepad', ''); f.textContent = n || 'Sans titre'; };
    const neu = () => { cur = null; t.value = ''; sv('sim-notepad', ''); f.textContent = 'Sans titre'; };
    win.onarg = n => n ? load(n) : neu();   // appelé par OS.open('notepad', 'fichier.txt')
    arg ? load(arg) : arg === '' ? neu() : load(null);
    // sauvegarde auto : fichier nommé -> fichier, sinon brouillon
    t.oninput = () => {
      if (cur && cur in OS.fs.d.f) { OS.fs.d.f[cur] = t.value; sv('sim-fs', JSON.stringify(OS.fs.d)); }
      else { cur = null; f.textContent = 'Sans titre'; sv('sim-notepad', t.value); }
    };
    box.querySelector('.n').onclick = neu;
    box.querySelector('.s').onclick = () => {
      const n = (prompt('Nom du fichier', cur || 'note.txt') || '').trim();
      if (!n) return;
      if (n in OS.fs.d.f && n !== cur && !confirm('Remplacer ' + n + ' ?')) return;
      OS.fs.d.f[n] = t.value; OS.fs.save(); load(n);
    };
  }
});

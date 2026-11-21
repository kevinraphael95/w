OS.register({
  id: 'notepad', name: 'Bloc-notes', icon: '📝', w: 520, h: 360,
  render(box) {
    const t = document.createElement('textarea');
    t.style.cssText = 'flex:1;border:0;outline:0;resize:none;padding:8px;font:14px Consolas,monospace';
    try { t.value = localStorage.getItem('sim-notepad') || ''; } catch (e) {}
    t.oninput = () => { try { localStorage.setItem('sim-notepad', t.value); } catch (e) {} };
    box.appendChild(t);
  }
});

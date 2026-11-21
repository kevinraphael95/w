OS.register({
  id: 'documents', name: 'Documents', icon: '📁', w: 500, h: 350,
  render(box) {
    box.style.padding = '16px';
    box.innerHTML = `<h3 style="margin:0 0 12px">📁 Fake W</h3>
      <div style="flex:1;overflow:auto;border:1px solid #ccc;background:#fff;padding:8px">
        <div style="padding:6px;border-bottom:1px solid #eee;cursor:default">📄 fichier1.txt</div>
        <div style="padding:6px;border-bottom:1px solid #eee;cursor:default">📄 fichier2.txt</div>
        <div style="padding:6px;border-bottom:1px solid #eee;cursor:default">🖼️ image.png</div>
        <div style="padding:6px;border-bottom:1px solid #eee;cursor:default">📁 sous-dossier</div>
      </div>`;
  }
});

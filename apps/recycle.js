OS.register({
  id: 'recycle', name: 'Corbeille', icon: '🗑️', w: 400, h: 300,
  render(box) {
    box.style.padding = '16px';
    box.innerHTML = `<h3 style="margin:0 0 12px">Corbeille</h3>
      <div class="list" style="flex:1;overflow:auto;border:1px solid #ccc;background:#fafafa;padding:8px">
        <p style="color:#999;text-align:center">La corbeille est vide.</p>
      </div>`;
  }
});

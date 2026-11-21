OS.register({
  id: 'settings', name: 'Paramètres', icon: '⚙️', w: 440, h: 320,
  render(box) {
    box.style.cssText += ';padding:16px;gap:10px';
    box.innerHTML = `<h3 style="margin:0">Personnalisation</h3><div>Arrière-plan</div><div class="sw" style="display:flex;gap:8px"></div>
      <div style="margin-top:10px">Nom du compte (affiché à la connexion)</div>
      <input class="nm" style="padding:6px;border:1px solid #888" value="${OS.user()}">`;
    OS.walls.forEach(([n, bg], i) => {
      const b = document.createElement('button');
      b.title = n; b.style.cssText = `width:72px;height:48px;border:2px solid #ccc;cursor:pointer;background:${bg}`;
      b.onclick = () => OS.setWall(i);
      box.querySelector('.sw').appendChild(b);
    });
    box.querySelector('.nm').oninput = e => OS.setUser(e.target.value);
  }
});

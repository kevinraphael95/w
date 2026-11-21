OS.register({
  id: 'settings', name: 'Paramètres', icon: '⚙️', w: 440, h: 340,
  render(box) {
    box.style.cssText += ';padding:16px;gap:10px';
    box.innerHTML = `<h3 style="margin:0">Personnalisation</h3><div>Arrière-plan</div><div class="sw" style="display:flex;gap:8px;flex-wrap:wrap"></div>
      <div style="margin-top:10px">Nom du compte (affiché à la connexion)</div>
      <input class="nm" style="padding:6px;border:1px solid #888">
      <div style="margin-top:10px"><button class="rs" style="padding:6px 12px;cursor:pointer">Réinitialiser le simulateur</button></div>`;
    const nm = box.querySelector('.nm'), sw = box.querySelector('.sw');
    nm.value = OS.user();
    const mark = () => [...sw.children].forEach((b, i) => b.classList.toggle('on', i === +st('sim-wall', 0)));
    OS.walls.forEach(([n, bg], i) => {
      const b = document.createElement('button');
      b.className = 'wp'; b.title = n; b.style.background = bg;
      b.onclick = () => { OS.setWall(i); mark(); };
      sw.appendChild(b);
    });
    mark();
    nm.oninput = () => OS.setUser(nm.value);
    box.querySelector('.rs').onclick = () => {
      if (confirm('Effacer fichiers, réglages et notes ?')) { try { localStorage.clear(); } catch (e) {} location.reload(); }
    };
  }
});

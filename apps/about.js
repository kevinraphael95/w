// MODÈLE D'APPLI : copie ce fichier, change id/name/icon, écris ton contenu dans render().
// Puis ajoute son nom (sans .js) dans la liste APPS de app.js. C'est tout.
OS.register({
  id: 'about', name: 'À propos', icon: '💻', w: 420, h: 260,
  render(box, win) {
    box.style.padding = '16px';
    box.innerHTML = `<h3 style="margin:0 0 8px">Win10 Sim</h3>
      <p>Simulateur de Windows 10 en HTML/CSS/JS pur, hébergeable sur GitHub Pages.</p>
      <p>Pour ajouter une appli : crée un fichier dans <code>apps/</code> avec <code>OS.register({id, name, icon, w, h, render(box, win)})</code>, puis ajoute son nom (sans .js) dans la liste <code>APPS</code> de <code>app.js</code>.</p>`;
  }
});

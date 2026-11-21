OS.register({
  id: 'settings', name: 'Paramètres', icon: '⚙️', w: 780, h: 520,
  render(box) {
    const T = [['💻', 'Système', 'Sauvegarde, réinitialisation'], ['⌨️', 'Périphériques', 'Bluetooth, imprimantes, souris'], ['📱', 'Appareils mobiles', 'Associer votre téléphone'],
      ['🌐', 'Réseau et Internet', 'Wi-Fi, mode Avion, VPN'], ['🎨', 'Personnalisation', 'Arrière-plan, écran de verrouillage'], ['🧩', 'Applications', 'Désinstaller, par défaut'],
      ['👤', 'Comptes', 'Nom du compte'], ['🕒', 'Heure et langue', 'Voix, région, date'], ['🎮', 'Jeux', 'Game Bar, captures, mode jeu'],
      ['♿', 'Options d’ergonomie', 'Narrateur, loupe, contraste'], ['🔍', 'Rechercher', 'Rechercher mes fichiers'], ['🔒', 'Confidentialité', 'Emplacement, caméra, microphone'],
      ['🔄', 'Mise à jour et sécurité', 'Windows Update, sauvegarde']];

    const home = () => {
      box.innerHTML = '<div class="st-top"><div class="st-av"></div><div><h2></h2><div>Compte local</div></div></div><div class="st-s"><input placeholder="Rechercher un paramètre"></div><div class="st-g"></div>';
      box.querySelector('.st-av').textContent = OS.user().charAt(0).toUpperCase();
      box.querySelector('h2').textContent = OS.user();
      const g = box.querySelector('.st-g'), inp = box.querySelector('input');
      const fill = () => {
        g.innerHTML = '';
        T.filter(t => (t[1] + t[2]).toLowerCase().includes(inp.value.toLowerCase())).forEach(([ic, n, d]) => {
          const b = document.createElement('div'); b.className = 'st-t';
          b.innerHTML = `<i>${ic}</i><div><b>${n}</b><br><small>${d}</small></div>`;
          b.onclick = () => page(n); g.appendChild(b);
        });
      };
      inp.oninput = fill; fill();
    };

    const page = n => {
      box.innerHTML = `<div class="tb"><button class="bk">← Accueil</button><b>${n}</b></div><div class="st-p"></div>`;
      box.querySelector('.bk').onclick = home;
      const p = box.querySelector('.st-p');
      const btn = (t, f) => { const b = document.createElement('button'); b.textContent = t; b.onclick = f; p.appendChild(b); };
      if (n === 'Personnalisation') {
        p.innerHTML = '<div>Arrière-plan</div><div class="sw"></div>';
        const sw = p.querySelector('.sw');
        const mark = () => [...sw.children].forEach((b, i) => b.classList.toggle('on', i === +st('sim-wall', 0)));
        OS.walls.forEach(([w, bg], i) => {
          const b = document.createElement('button'); b.className = 'wp'; b.title = w; b.style.background = bg;
          b.onclick = () => { OS.setWall(i); mark(); }; sw.appendChild(b);
        });
        mark();
      } else if (n === 'Comptes') {
        p.innerHTML = '<div>Nom du compte (affiché à la connexion)</div><input>';
        const i = p.querySelector('input'); i.value = OS.user(); i.oninput = () => OS.setUser(i.value);
      } else if (n === 'Système') {
        p.innerHTML = '<div>Tes réglages (fond, nom, position des icônes, fichiers) sont enregistrés dans le navigateur. Exporte-les dans <b>settings.json</b> et mets ce fichier dans le dossier du site pour les retrouver partout.</div>';
        btn('Exporter settings.json', OS.exportCfg);
        const fi = document.createElement('input'); fi.type = 'file'; fi.accept = '.json'; fi.hidden = true;
        fi.onchange = async () => { try { OS.importCfg(JSON.parse(await fi.files[0].text())); } catch (e) { alert('Fichier invalide'); } };
        p.appendChild(fi); btn('Importer un settings.json', () => fi.click());
        btn('Réinitialiser le simulateur', () => { if (confirm('Tout effacer (fichiers, réglages, positions) ?')) { try { localStorage.clear(); } catch (e) {} sv('sim-init', '1'); location.reload(); } });
      } else p.innerHTML = '<div>Cette section n’est pas encore disponible.</div>';
    };
    home();
  }
});

// Pour ajouter une appli : crée apps/ton-appli.js puis ajoute 'ton-appli' ici.
const APPS = ['explorer', 'notepad', 'calculator', 'paint', 'recycle', 'settings', 'about'];

const loadApp = n => new Promise(ok => {
  const s = document.createElement('script');
  s.src = `apps/${n}.js`;
  s.onload = ok;
  s.onerror = () => { console.warn('Appli introuvable : apps/' + n + '.js'); ok(); };
  document.body.appendChild(s);
});

(async () => {
  for (const n of APPS) await loadApp(n);
  // 1er lancement : on lit settings.json (dossier du site) comme réglages de départ
  if (!st('sim-init', '')) {
    try {
      const r = await fetch('settings.json');
      if (r.ok) { OS.importCfg(await r.json(), false); try { OS.fs.d = JSON.parse(st('sim-fs', '')) || OS.fs.d; } catch (e) {} }
    } catch (e) {}
    sv('sim-init', '1');
  }
  OS.boot();
})();

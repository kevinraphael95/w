// Pour ajouter une appli : crée apps/ton-appli.js puis ajoute 'ton-appli' ici.
const APPS = ['explorer', 'browser', 'notepad', 'calculator', 'paint', 'recycle', 'settings', 'about'];

const tryLoad = src => new Promise(ok => {
  const s = document.createElement('script');
  s.src = src;
  s.onload = () => ok(true);
  s.onerror = () => { s.remove(); ok(false); };
  document.body.appendChild(s);
});
// cherche apps/nom.js, puis nom.js à la racine (au cas où le fichier n'est pas rangé dans apps/)
const loadApp = async n => {
  if (!(await tryLoad(`apps/${n}.js`)) && !(await tryLoad(`${n}.js`))) console.warn('Appli introuvable : ' + n + '.js (ni dans apps/, ni à la racine)');
};

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

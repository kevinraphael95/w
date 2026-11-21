// Pour ajouter une appli : crée apps/ton-appli.js puis ajoute 'ton-appli' ici.
const APPS = ['documents', 'notepad', 'calculator', 'recycle', 'settings', 'about'];

const loadApp = n => new Promise(ok => {
  const s = document.createElement('script');
  s.src = `apps/${n}.js`;
  s.onload = ok;
  s.onerror = () => { console.warn('Appli introuvable : apps/' + n + '.js'); ok(); };
  document.body.appendChild(s);
});

// on charge tout dans l'ordre, PUIS on démarre (avant : boot() partait trop tôt)
(async () => { for (const n of APPS) await loadApp(n); OS.boot(); })();

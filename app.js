// Infos de ton dépôt GitHub
const GITHUB_USER = 'kevinraphael95';
const GITHUB_REPO = 'w';

const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/apps`;

fetch(apiUrl)
  .then(r => {
    if (!r.ok) throw new Error("Erreur API");
    return r.json();
  })
  .then(files => {
    // On garde seulement les fichiers .js
    const appList = files
      .filter(f => f.name.endsWith('.js'))
      .map(f => 'apps/' + f.name);

    // On charge tout automatiquement
    appList.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      document.body.appendChild(script);
    });
  })
  .catch(() => {
    // Solution de secours si l'API ne répond pas (ex: en local)
    console.warn("API GitHub inaccessible, chargement de secours.");
    const fallback = [
      'apps/notepad.js', 'apps/calculator.js', 'apps/settings.js',
      'apps/about.js', 'apps/recycle.js', 'apps/documents.js', 'apps/browser.js'
    ];
    fallback.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      document.body.appendChild(script);
    });
  });

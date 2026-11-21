const appList = [
    'apps/notepad.js',
    'apps/calculator.js',
    'apps/settings.js',
    'apps/about.js',
    'apps/recycle.js',
    'apps/documents.js'
];

appList.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
});

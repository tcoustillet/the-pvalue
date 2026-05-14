(function () {
  function loadScript(src, onload) {
    const s = document.createElement('script');
    s.src = src;
    if (onload) s.onload = onload;
    document.head.appendChild(s);
  }

  window.katexReady = new Promise(function (resolve) {
    loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js', function () {
      loadScript(
        'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js',
        function () {
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
              renderMathInElement(document.body, {
                delimiters: [
                  { left: '$$', right: '$$', display: true },
                  { left: '$', right: '$', display: false },
                ],
              });
              resolve();
            });
          } else {
            renderMathInElement(document.body, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
              ],
            });
            resolve();
          }
        }
      );
    });
  });
})();

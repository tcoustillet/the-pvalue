// katex-macros.js

(function () {
  const FLAGS = {
    fr: '\u{1F1EB}\u{1F1F7}',
    se: '\u{1F1F8}\u{1F1EA}',
  };

  const defs = Object.entries(FLAGS)
    .map(([code, flag]) => `\\gdef\\sub${code}#1{{#1}_{{}_\\text{\\scriptsize ${flag}}}}`)
    .join('');

  const div = document.createElement('div');
  div.style.display = 'none';
  div.textContent = '$' + defs + '$';
  document.currentScript.insertAdjacentElement('afterend', div);
})();

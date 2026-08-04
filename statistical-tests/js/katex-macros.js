// katex-macros.js

(function () {
  const FLAGS = {
    fr: '\u{1F1EB}\u{1F1F7}',
    se: '\u{1F1F8}\u{1F1EA}',
    no: '\u{1F1F3}\u{1F1F4}',
    cv: '\u{1F1E8}\u{1F1FB}',
  };

  const flagDefs = Object.entries(FLAGS)
    .map(([code, flag]) => `\\gdef\\sub${code}#1{{#1}_{{}_\\text{\\scriptsize ${flag}}}}`)
    .join('');

  const subTextDefs = `\\gdef\\subsub#1#2{\\text{#1}_{\\text{#2}}}`;

  const defs = flagDefs + subTextDefs;

  const div = document.createElement('div');
  div.style.display = 'none';
  div.textContent = '$' + defs + '$';
  document.currentScript.insertAdjacentElement('afterend', div);
})();

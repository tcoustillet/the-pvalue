const LANG = {
  nSliderLabel: 'Nombre de lancers : ',
  xAxisLabel: 'Nombre de faces',
  yAxisLabel: 'Probabilité',
  fairCoin: 'pièce équilibrée',
};

LANG.faces = (k) => (k > 1 ? 'faces' : 'face');

LANG.sentenceEq = (n, k, faces, probPercent) =>
  `Lorsqu'on lance ${n} fois une pièce équilibrée, la probabilité d'obtenir exactement ${k} ${faces} est de ${probPercent}%.`;

LANG.sentenceGte = (
  n,
  k,
  faces,
  probPercent,
  probDecimal
) => `Vous lancez ${n} fois une pièce et obtenez ${k} ${faces}. Que pouvez-vous en conclure ? Est-il raisonnable de croire que la pièce est truquée en faveur du côté face ? Lorsqu'on lance ${n} fois une pièce équilibrée, la probabilité d'obtenir ${k} ${faces} ou plus est de ${probPercent}%. 
     Dans cette expérience et ces conditions particulières, vous obtenez p-value = ${probDecimal}.`;

LANG.pvalueHigh = (H0, H1, pGte) =>
  `Étant donné que ${pGte} : le résultat obtenu n'est pas extraordinaire dans le monde de ${H0}. Nous n'avons pas amassé suffisament de preuves pour basculer vers ${H1} et conclure que la pièce est truquée en faveur du côté face : nous devons rester dans ${H0}. Soit notre pièce n'est pas truquée en faveur du côté face, soit elle l'est mais nous n'en avons pas la preuve.`;

LANG.pvalueLow = (H0, H1, pLt) =>
  `Étant donné que ${pLt} : le résultat obtenu est extraordinaire dans le monde de ${H0}. Si la pièce était vraiment équilibrée, observer ce résultat aurait été trop peu probable. Avec un niveau de preuve suffisant, on bascule vers ${H1} : on peut raisonnablement croire que notre est pièce est truquée en faveur du côté face.`;

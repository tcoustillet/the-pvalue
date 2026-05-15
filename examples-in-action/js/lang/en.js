const LANG = {
  nSliderLabel: 'Number of flips: ',
  xAxisLabel: 'Number of heads',
  yAxisLabel: 'Probability',
  fairCoin: 'fair coin',
  randomVar: 'H',
};

LANG.faces = (k) => (k > 1 ? 'heads' : 'head');

LANG.sentenceEq = (n, k, heads, probPercent) =>
  `When flipping a fair coin ${n} times, the probability of getting exactly ${k} ${heads} is ${probPercent}%.`;

LANG.sentenceGte = (
  n,
  k,
  heads,
  probPercent,
  probDecimal
) => `You flip a coin ${n} times and get ${k} ${heads}. What can you conclude? Is it reasonable to believe the coin is biased towards heads? When flipping a fair coin ${n} times, the probability of getting ${k} ${heads} or more is ${probPercent}%.
      In this particular experiment and conditions, you get p-value = ${probDecimal}.`;
LANG.pvalueHigh = (H0, H1, pGte) =>
  `Since ${pGte}: the result is not extraordinary in the world of ${H0}. We have not gathered enough evidence to shift towards ${H1} and conclude that the coin is biased: we must remain in ${H0}. Either our coin is not biased towards heads, or it is but we have no proof of it.`;
LANG.pvalueLow = (H0, H1, pLt) =>
  `Since ${pLt}: the result is extraordinary in the world of ${H0}. If the coin were truly fair, observing this result would have been too unlikely. With sufficient evidence, we shift towards ${H1}: we can reasonably believe that our coin is biased towards heads.`;

LANG.pvalueWarning = (n, k, faces, probPercent) =>
  `<strong><u>It is wrong to claim</u></strong> that, if ${k} ${faces} are obtained out of ${n} tosses, the coin has a ${probPercent}% chance of <strong>not being</strong> biased towards heads.`;

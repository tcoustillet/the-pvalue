const LANG = {
  sachant: 'given',
  randomVarLabel: 'H',
  conditions: [
    'that they are French',
    'that they are a French woman',
    'that they are a French man',
    'that they are Swedish',
    'that they are a Swedish woman',
    'that they are a Swedish man',
    'that they are an American basketball player',
  ],
  groupLabels: [
    'French people',
    'French women',
    'French men',
    'Swedish people',
    'Swedish women',
    'Swedish men',
    'American basketball players',
  ],
  xLabel: 'height (cm)',
  yLabel: 'density',
};

LANG.textLess = (a, condition, groupLabel, probPercent) =>
  `The probability that a randomly selected person is shorter than ${a} cm, given ${condition}, is ${probPercent}%.
    In other words, ${probPercent}% of ${groupLabel} are shorter than ${a} cm.`;

LANG.textGreater = (a, condition, groupLabel, probPercent) =>
  `The probability that a randomly selected person is taller than ${a} cm, given ${condition}, is ${probPercent}%.
    In other words, ${probPercent}% of ${groupLabel} are taller than ${a} cm.`;

LANG.textBetween = (a, b, condition, groupLabel, probPercent) =>
  `The probability that a randomly selected person is between ${a} cm and ${b} cm tall, given ${condition}, is ${probPercent}%.
   In other words, ${probPercent}% of ${groupLabel} are between ${a} cm and ${b} cm tall.`;

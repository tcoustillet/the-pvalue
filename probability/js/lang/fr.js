const LANG = {
  sachant: 'sachant',
  randomVarLabel: 'T',
  conditions: [
    "qu'elle est de nationalité française",
    "qu'il s'agit d'une femme française",
    "qu'il s'agit d'un homme français",
    "qu'elle est de nationalité suédoise",
    "qu'il s'agit d'une femme suédoise",
    "qu'il s'agit d'un homme suédois",
    "qu'il s'agit d'un basketteur américain",
  ],
  groupLabels: [
    'français',
    'françaises',
    'hommes français',
    'suédois',
    'suédoises',
    'hommes suédois',
    'basketteurs américains',
  ],
};

LANG.textLess = (a, condition, groupLabel, probPercent) =>
  `La probabilité qu'une personne tirée au hasard mesure moins de ${a} cm, sachant ${condition}, est de ${probPercent}%.
    Autrement dit, ${probPercent}% des ${groupLabel} mesurent moins de ${a} cm.`;

LANG.textGreater = (a, condition, groupLabel, probPercent) =>
  `La probabilité qu'une personne tirée au hasard mesure plus de ${a} cm, sachant ${condition}, est de ${probPercent}%.
    Autrement dit, ${probPercent}% des ${groupLabel} mesurent plus de ${a} cm.`;

LANG.textBetween = (a, b, condition, groupLabel, probPercent) =>
  `La probabilité qu'une personne tirée au hasard mesure entre ${a} cm et ${b} cm, sachant ${condition}, est de ${probPercent}%.
    Autrement dit, ${probPercent}% des ${groupLabel} mesurent entre ${a} cm et ${b} cm.`;

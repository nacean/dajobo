export const getEffectLevel = (gauge: number) => {
  if (gauge >= 10) {
    return 5;
  } else if (gauge >= 9) {
    return 4;
  } else if (gauge >= 8) {
    return 3;
  } else if (gauge >= 6) {
    return 2;
  } else if (gauge >= 3) {
    return 1;
  } else {
    return 0;
  }
};
export const getPercentageFromWeight = (weight: number) => {
  const percentage = (weight * 100).toFixed(1) + '%';

  return percentage;
};

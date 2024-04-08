import { Effect } from '@src/types/effect';
import Chooser from 'random-seed-weighted-chooser';

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

export const pickEffectToUpdate = (pickedEffects: Effect[], updateCount: number) => {
  const newPickedEffects = pickedEffects;
  let newUpdateCount = updateCount;
  //index 선택
  const pickWeightArray = pickedEffects.map(effect => effect.pickWeight);
  const indexToUpdate = Chooser.chooseWeightedIndex(pickWeightArray);

  //대성공 판별
  const greatWeightLine = Math.random();

  if (newPickedEffects[indexToUpdate].greatWeight >= greatWeightLine && newUpdateCount > 0) {
    newUpdateCount += 1;
  }

  //게이지 설정
  let newGauge = (newPickedEffects[indexToUpdate].gauge += newUpdateCount);

  if (newGauge < 0) {
    newGauge = 0;
  } else if (newGauge >= 10) {
    newGauge = 10;
  }

  newPickedEffects[indexToUpdate].gauge = newGauge;

  return newPickedEffects;
};

export const pickEffectToUpdateSimultaneously = (pickedEffects: Effect[], simulCount: number) => {
  const newPickedEffects = pickedEffects;

  //index 선택
  const pickWeightArray = pickedEffects.map(effect => effect.pickWeight);
  const indexesToUpdate: number[] = [];

  while (indexesToUpdate.length !== simulCount) {
    const indexToUpdate = Chooser.chooseWeightedIndex(pickWeightArray);
    if (!indexesToUpdate.includes(indexToUpdate)) {
      indexesToUpdate.push(indexToUpdate);
    }
  }

  indexesToUpdate.forEach(indexToUpdate => {
    //대성공 판별
    let newUpdateCount = 1;

    const greatWeightLine = Math.random();

    if (newPickedEffects[indexToUpdate].greatWeight >= greatWeightLine && newUpdateCount > 0) {
      newUpdateCount += 1;
    }

    //게이지 설정
    let newGauge = (newPickedEffects[indexToUpdate].gauge += newUpdateCount);

    if (newGauge < 0) {
      newGauge = 0;
    } else if (newGauge >= 10) {
      newGauge = 10;
    }

    newPickedEffects[indexToUpdate].gauge = newGauge;
  });

  return newPickedEffects;
};

export const updateEffectsWeight = (
  pickedEffects: Effect[],
  index: number,
  weightToAdd: number,
) => {
  const newPickedEffects = pickedEffects;
  let newWeightToAdd = weightToAdd;

  if (pickedEffects[index].pickWeight + newWeightToAdd > 1) {
    newWeightToAdd = 1 - pickedEffects[index].pickWeight;
    newPickedEffects[index].pickWeight = 1;
  } else if (pickedEffects[index].pickWeight + newWeightToAdd < 0) {
    newWeightToAdd = -pickedEffects[index].pickWeight;
    newPickedEffects[index].pickWeight = 0;
  } else {
    newPickedEffects[index].pickWeight += weightToAdd;
  }

  const weightToAddOthers = newWeightToAdd / 4;
  for (let i = 0; i < newPickedEffects.length; i++) {
    if (i === index) {
      continue;
    }
    newPickedEffects[i].pickWeight -= weightToAddOthers;
  }

  return newPickedEffects;
};

export const updateEffectGreatWeight = (
  pickedEffects: Effect[],
  index: number,
  greatWeightToAdd: number,
) => {
  const newPickedEffects = pickedEffects;
  const newGreatWeightToAdd =
    pickedEffects[index].greatWeight + greatWeightToAdd > 1
      ? 1
      : pickedEffects[index].greatWeight + greatWeightToAdd;

  newPickedEffects[index].greatWeight = newGreatWeightToAdd;

  return newPickedEffects;
};

export const updateAllEffectsGreatWeight = (pickedEffects: Effect[], greatWeightToAdd: number) => {
  const newPickedEffects = pickedEffects.map(pickedEffect => {
    const newPickedEffect = pickedEffect;
    const newGreatWeightToAdd =
      pickedEffect.greatWeight + greatWeightToAdd > 1
        ? 1
        : pickedEffect.greatWeight + greatWeightToAdd;

    newPickedEffect.greatWeight = newGreatWeightToAdd;

    return newPickedEffect;
  });

  return newPickedEffects;
};

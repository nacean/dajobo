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
  const weightToAddOthers = newWeightToAdd / 4;

  if (pickedEffects[index].pickWeight + newWeightToAdd > 1) {
    newWeightToAdd = 1 - pickedEffects[index].pickWeight;
    newPickedEffects[index].pickWeight = 1;
  } else if (pickedEffects[index].pickWeight + newWeightToAdd < 0) {
    newWeightToAdd = -pickedEffects[index].pickWeight;
    newPickedEffects[index].pickWeight = 0;
  } else {
    newPickedEffects[index].pickWeight += weightToAdd;
  }

  for (let i = 0; i < newPickedEffects.length; i++) {
    if (i === index) {
      continue;
    }

    if (newPickedEffects[index].pickWeight === 1) {
      newPickedEffects[i].pickWeight = 0;
    } else {
      newPickedEffects[i].pickWeight -= weightToAddOthers;
    }
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

export const updateEffectRandomGauge = (
  effects: Effect[],
  pickedIndex: number,
  minUpdateGauge: number,
  maxUpdateGauge: number,
) => {
  const updateGaugeArray = [];

  for (let i = minUpdateGauge; i <= maxUpdateGauge; i++) {
    updateGaugeArray.push(i);
  }

  const gaugeToUpdate = updateGaugeArray[Chooser.chooseWeightedIndex(updateGaugeArray)];

  const newEffects = effects.map((effect, index) => {
    const newEffect = effect;
    if (index === pickedIndex) {
      //게이지 설정
      let newGauge = (effect.gauge += gaugeToUpdate);

      if (newGauge < 0) {
        newGauge = 0;
      } else if (newGauge >= 10) {
        newGauge = 10;
      }

      newEffect.gauge = newGauge;
    }

    return newEffect;
  });

  return newEffects;
};

export const upOrDownEffectGaugeExactNumber = (
  effects: Effect[],
  pickedIndex: number,
  gaugeToUpdate: number,
) => {
  const newEffects = effects.map((effect, index) => {
    const newEffect = effect;
    if (index === pickedIndex) {
      //게이지 설정
      let newGauge = (effect.gauge += gaugeToUpdate);

      if (newGauge >= 10) {
        newGauge = 10;
      }
      if (newGauge <= 0) {
        newGauge = 0;
      }

      newEffect.gauge = newGauge;
    }

    return newEffect;
  });

  return newEffects;
};

export const upEffectGaugeByRandom = (
  effects: Effect[],
  pickedIndex: number,
  upProbability: number,
) => {
  const randomNumber = Math.random();

  if (randomNumber > upProbability) {
    return effects;
  }

  const newEffects = upOrDownEffectGaugeExactNumber(effects, pickedIndex, 1);

  return newEffects;
};

export const upEffectGaugeByEvenly = (effects: Effect[]) => {
  const indexes = [0, 1, 2, 3, 4];

  const pickedIndex = Chooser.chooseWeightedIndex(indexes);

  const newEffects = upOrDownEffectGaugeExactNumber(effects, pickedIndex, 1);

  return newEffects;
};

export const changeEffectGaugeExactNumber = (
  effects: Effect[],
  pickedIndex: number,
  minUpdateGauge: number,
  maxUpdateGauge: number,
) => {
  const updateGaugeArray = [];

  for (let i = minUpdateGauge; i <= maxUpdateGauge; i++) {
    updateGaugeArray.push(i);
  }

  const gaugeToChange = updateGaugeArray[Chooser.chooseWeightedIndex(updateGaugeArray)];

  const newEffects = effects.map((effect, index) => {
    const newEffect = effect;
    if (index === pickedIndex) {
      //게이지 설정
      newEffect.gauge = gaugeToChange;
    }

    return newEffect;
  });

  return newEffects;
};

export const upAndDownTwoEffectGauges = (
  effects: Effect[],
  upIndex: number,
  downIndex: number,
  upGauge: number,
  downGauge: number,
) => {
  const upUpdatedEffects = upOrDownEffectGaugeExactNumber(effects, upIndex, upGauge);
  const downUpdatedEffects = upOrDownEffectGaugeExactNumber(
    upUpdatedEffects,
    downIndex,
    -downGauge,
  );

  return downUpdatedEffects;
};

export const getMostHighGaugeEffectIndex = (effects: Effect[]) => {
  let mostGauge = 0;
  let mostGaugeIndex = 0;

  effects.forEach((effect, index) => {
    if (mostGauge <= effect.gauge) {
      mostGauge = effect.gauge;
      mostGaugeIndex = index;
    }
  });

  return mostGaugeIndex;
};

export const getLeastLowGaugeEffectIndex = (effects: Effect[]) => {
  let leastGauge = 10;
  let leastGaugeIndex = 0;

  effects.forEach((effect, index) => {
    if (leastGauge >= effect.gauge) {
      leastGauge = effect.gauge;
      leastGaugeIndex = index;
    }
  });

  return leastGaugeIndex;
};

export const exchangeGaugeBetweenTwoEffects = (
  effects: Effect[],
  firstIndex: number,
  secondIndex: number,
) => {
  const firstIndexGauge = effects[firstIndex].gauge;
  const secondIndexGauge = effects[secondIndex].gauge;

  const newEffects = effects.map((effect, index) => {
    const newEffect = effect;

    if (index === firstIndex) {
      newEffect.gauge = secondIndexGauge;
    }
    if (index === secondIndex) {
      newEffect.gauge = firstIndexGauge;
    }

    return newEffect;
  });

  return newEffects;
};

export const getRandomEffectIndexExceptPickedIndex = (pickedIndex: number) => {
  const indexes: number[] = [];
  for (let i = 0; i < 5; i++) {
    if (i !== pickedIndex) {
      indexes.push(i);
    }
  }

  const randomPickedEffectIndex = Chooser.chooseWeightedIndex(indexes);

  const randomPickedIndex = indexes[randomPickedEffectIndex];

  return randomPickedIndex;
};

export const upAllEffectThatGaugesUnderNumber = (effects: Effect[], maxGaugeNumber: number) => {
  const newEffects = effects.map(effect => {
    const newEffect = effect;

    if (newEffect.gauge <= maxGaugeNumber) {
      newEffect.gauge += 1;
    }

    return newEffect;
  });

  return newEffects;
};

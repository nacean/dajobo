import { BasicAdvice } from '@src/types/basicAdvice';
import { Effect } from '@src/types/effect';
import { pickEffectToUpdate, updateEffectsWeight } from '@src/utils/effectUtils';
import { ParseResult } from 'papaparse';
import Chooser from 'random-seed-weighted-chooser';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePapaParse } from 'react-papaparse';

const useElixir = () => {
  const [effects, setEffects] = useState<Effect[]>([]); // 효과 전체
  const [proposedEffects, setProposedEffects] = useState<Effect[]>([]); // 초반 제안 3가지 효과

  const [lastPickedEffects, setLastPickedEffects] = useState<Effect[]>([]); // 다시 되돌릴 뽑은 효과(총 5개)
  const onlyThisTime = useRef<boolean>(false);

  const [pickedEffects, setPickedEffects] = useState<Effect[]>([]); // 내가 뽑은 효과(총 5개)

  const [basicAdvices, setBasicAdvices] = useState<BasicAdvice[]>([]); // 기초 조언 전체
  const [proposedAdvices, setProposedAdvices] = useState<BasicAdvice[]>([]); // 현자가 제안하는 조언 3가지
  const [pickedAdvice, setPickedAdvice] = useState<BasicAdvice | null>(null); // 유저가 선택한 조언

  const [isUserSelectAdvice, setIsUserSelectAdvice] = useState<boolean>(false); //유저가 조언을 골랐는가? 골랐으면 효과 정제 차례

  const [round, setRound] = useState(0); // 몇번째 정재인지 (기본은 0~13까지 가능)

  const { readString } = usePapaParse();

  //func 0,2
  const regulateWeightThisTime = (advice: BasicAdvice) => {
    // 백업해두기
    const syncPickedEffects = pickedEffects;
    setLastPickedEffects(syncPickedEffects);
    onlyThisTime.current = true;

    const refinedProbability = advice.adviceNum === 2 ? -advice.probability : advice.probability;
    //깊은 복사를 위한 deep copy
    const copiedEffects = JSON.parse(JSON.stringify(pickedEffects));

    const regulatedEffects = updateEffectsWeight(copiedEffects, advice.target, refinedProbability);
    setPickedEffects(regulatedEffects);
  };

  //func 1,3
  const regulateWeightAllTime = (advice: BasicAdvice) => {
    const refinedProbability = advice.adviceNum === 3 ? -advice.probability : advice.probability;
    const copiedEffects = JSON.parse(JSON.stringify(pickedEffects));

    const regulatedEffects = updateEffectsWeight(copiedEffects, advice.target, refinedProbability);

    setPickedEffects(regulatedEffects);
  };

  const getProposedEffects = useCallback((effects: Effect[]) => {
    if (effects.length === 0) {
      return;
    }

    const newEffectsToUpdate: Effect[] = [];

    for (let i = 0; i < 3; i++) {
      while (newEffectsToUpdate.length === i) {
        const newEffect = Chooser.chooseWeightedObject(effects) as Effect;
        if (newEffectsToUpdate.indexOf(newEffect) === -1) {
          newEffectsToUpdate.push(newEffect);
        }
      }
    }

    setProposedEffects(newEffectsToUpdate);
  }, []);

  const getAllEffects = useCallback(async () => {
    const response = await fetch('csv/effects.csv');
    const reader = response.body?.getReader();
    const result = await reader?.read();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result?.value);
    readString(csv, {
      header: true,
      worker: true,
      dynamicTyping: true,
      complete: (result: ParseResult<Effect>) => {
        const refinedEffects: Effect[] = result.data.map(effect => ({
          ...effect,
          pickWeight: 0.2,
          greatWeight: 0.1,
          isLocked: false,
          gauge: 0,
        }));

        setEffects(refinedEffects);
        getProposedEffects(refinedEffects);
      },
    });
  }, [getProposedEffects, readString]);

  const pickEffect = (effect: Effect) => {
    let newEffects = effects;

    //뽑은 effect 확률 0으로
    const findIndex = effects.findIndex(nowEffect => nowEffect === effect);
    newEffects[findIndex].weight = 0;

    //뽑은게 공용이 아니라면 그 부위 옵션은 못뽑게 수정
    if (effect.typeName !== '공용') {
      newEffects = newEffects.map(nowEffect => {
        if (effect.typeName === nowEffect.typeName) {
          const newEffect = nowEffect;
          newEffect.weight = 0;
          return newEffect;
        }
        return nowEffect;
      });
    }

    const newPickedEffects = [...pickedEffects, effect];
    setPickedEffects(newPickedEffects);

    //확률 업데이트 및 새로 effect 뽑기
    setEffects(newEffects);
    getProposedEffects(newEffects);
  };

  const getProposedAdvices = useCallback(
    (advices: BasicAdvice[]) => {
      //TODO : 질서, 혼돈 등 다른 조언도 추가?
      if (advices.length === 0) {
        return;
      }

      const newAdvicesToUpdate: BasicAdvice[] = [];

      for (let i = 0; i < 3; i++) {
        const newAdvice = Chooser.chooseWeightedObject(advices, 'weight' + round) as BasicAdvice;
        newAdvicesToUpdate.push(newAdvice);
      }

      setProposedAdvices(newAdvicesToUpdate);
    },
    [round],
  );

  const getAllBasicAdvices = useCallback(async () => {
    const response = await fetch('csv/basicAdvices.csv');
    const reader = response.body?.getReader();
    const result = await reader?.read();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result?.value);
    readString(csv, {
      header: true,
      worker: true,
      dynamicTyping: true,
      complete: (result: ParseResult<BasicAdvice>) => {
        setBasicAdvices(result.data);
        getProposedAdvices(result.data);
      },
    });
  }, [getProposedAdvices, readString]);

  const pickAdvice = (advice: BasicAdvice) => {
    setPickedAdvice(advice);
  };

  const elixirFuncs = [
    regulateWeightThisTime,
    regulateWeightAllTime,
    regulateWeightThisTime,
    regulateWeightAllTime,
  ];

  const adaptAdvice = () => {
    if (pickedAdvice === null) {
      //TODO : advice 안골랐을때 notice 주기
      return;
    }

    elixirFuncs[pickedAdvice.adviceNum](pickedAdvice);

    // 이후 처리
    setIsUserSelectAdvice(true);
  };

  const executeMagic = () => {
    const copiedEffects = JSON.parse(JSON.stringify(pickedEffects));
    const newPickedEffects = pickEffectToUpdate(copiedEffects, 1);
    setPickedEffects(newPickedEffects);

    getProposedAdvices(basicAdvices);
    //TODO : advice 구현

    // 이후 초기화 처리
    setRound(round + 1);
    setIsUserSelectAdvice(false);
    setPickedAdvice(null);
    if (onlyThisTime.current) {
      console.log(lastPickedEffects);
      setPickedEffects(lastPickedEffects);
      onlyThisTime.current = false;
    }
  };

  useEffect(() => {
    getAllEffects();
    getAllBasicAdvices();
  }, []);

  return {
    proposedEffects,
    pickedEffects,
    pickEffect,
    proposedAdvices,
    pickAdvice,
    round,
    adaptAdvice,
    executeMagic,
    isUserSelectAdvice,
    pickedAdvice,
  };
};
export default useElixir;

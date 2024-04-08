import { BasicAdvice } from '@src/types/basicAdvice';
import { Effect } from '@src/types/effect';
import {
  pickEffectToUpdate,
  pickEffectToUpdateSimultaneously,
  updateEffectsWeight,
} from '@src/utils/effectUtils';
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

  const [indexToAdjustAdvice, setIndexToAdjustAdvice] = useState<number | null>(null); //effect 선택형 조언 일때 사용

  const [simulEffectCount, setSimulEffectCount] = useState<number>(1);
  const [gaugeUpdateCount, setGaugeUpdateCount] = useState<number>(1); //연성할 게이지 개수
  const [roundRemoveCount, setRoundRemoveCount] = useState<number>(1); //차감할 연성 기회 개수
  const [round, setRound] = useState(0); // 몇번째 정재인지 (기본은 0~13까지 가능)

  //TODO : 이후 실 사용시 기본 2회로 변경
  const [otherAdvicesCount, setOtherAdvicesCount] = useState<number>(9999); //다른 조언 보기 가능 횟수

  const { readString } = usePapaParse();

  //TODO : func 0,1,2,3 합치기
  //func 0,2
  const regulateWeightThisTime = () => {
    if (pickedAdvice === null) {
      return;
    }
    // 백업해두기
    const syncPickedEffects = pickedEffects;
    setLastPickedEffects(syncPickedEffects);
    onlyThisTime.current = true;

    const refinedProbability =
      pickedAdvice.adviceNum === 2 ? -pickedAdvice.probability : pickedAdvice.probability;
    //깊은 복사를 위한 deep copy
    const copiedEffects = JSON.parse(JSON.stringify(pickedEffects));

    if (typeof pickedAdvice.target === 'number') {
      const regulatedEffects = updateEffectsWeight(
        copiedEffects,
        pickedAdvice.target,
        refinedProbability,
      );
      setPickedEffects(regulatedEffects);
    } else if (pickedAdvice.target === 'pick' && indexToAdjustAdvice !== null) {
      const regulatedEffects = updateEffectsWeight(
        copiedEffects,
        indexToAdjustAdvice,
        refinedProbability,
      );
      setPickedEffects(regulatedEffects);
    }
  };

  //func 1,3
  const regulateWeightAllTime = () => {
    if (pickedAdvice === null) {
      return;
    }

    const refinedProbability =
      pickedAdvice.adviceNum === 3 ? -pickedAdvice.probability : pickedAdvice.probability;
    const copiedEffects = JSON.parse(JSON.stringify(pickedEffects));

    if (typeof pickedAdvice.target === 'number') {
      const regulatedEffects = updateEffectsWeight(
        copiedEffects,
        pickedAdvice.target,
        refinedProbability,
      );
      setPickedEffects(regulatedEffects);
    } else if (pickedAdvice.target === 'pick' && indexToAdjustAdvice !== null) {
      const regulatedEffects = updateEffectsWeight(
        copiedEffects,
        indexToAdjustAdvice,
        refinedProbability,
      );
      setPickedEffects(regulatedEffects);
    }
  };

  //func 4
  const snipeEffect = () => {
    if (pickedAdvice === null) {
      return;
    }
    // 백업해두기
    const syncPickedEffects = pickedEffects;
    setLastPickedEffects(syncPickedEffects);
    onlyThisTime.current = true;

    //깊은 복사를 위한 deep copy
    const copiedEffects = JSON.parse(JSON.stringify(pickedEffects));

    if (typeof pickedAdvice.target === 'number') {
      const regulatedEffects = updateEffectsWeight(copiedEffects, pickedAdvice.target, 1);
      setPickedEffects(regulatedEffects);
    } else if (pickedAdvice.target === 'pick' && indexToAdjustAdvice !== null) {
      const regulatedEffects = updateEffectsWeight(copiedEffects, indexToAdjustAdvice, 1);
      setPickedEffects(regulatedEffects);
    }
  };

  //func 5
  const snipeEffectUseRoundTwo = () => {
    if (pickedAdvice === null) {
      return;
    }

    // 백업해두기
    const syncPickedEffects = pickedEffects;
    setLastPickedEffects(syncPickedEffects);
    onlyThisTime.current = true;

    //깊은 복사를 위한 deep copy
    const copiedEffects = JSON.parse(JSON.stringify(pickedEffects));

    if (typeof pickedAdvice.target === 'number') {
      const regulatedEffects = updateEffectsWeight(copiedEffects, pickedAdvice.target, 1);
      setPickedEffects(regulatedEffects);
    } else if (pickedAdvice.target === 'pick' && indexToAdjustAdvice !== null) {
      const regulatedEffects = updateEffectsWeight(copiedEffects, indexToAdjustAdvice, 1);
      setPickedEffects(regulatedEffects);
    }

    setGaugeUpdateCount(2);
    setRoundRemoveCount(2);
  };

  //func 6
  const gaugeTwoThisTime = () => {
    setGaugeUpdateCount(2);
  };

  //func 7
  const gaugeThreeThisTimeUseRoundTwo = () => {
    setGaugeUpdateCount(3);
    setRoundRemoveCount(2);
  };

  //func 8
  const magicDoubleEffects = () => {
    setSimulEffectCount(2);
  };

  //func 9
  const magicTripleEffects = () => {
    setSimulEffectCount(3);
    setRoundRemoveCount(2);
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

  const getOtherAdvices = () => {
    if (otherAdvicesCount === 0) {
      return;
    }

    getProposedAdvices(basicAdvices);
    setOtherAdvicesCount(otherAdvicesCount - 1);
  };

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
    if (isUserSelectAdvice) {
      return;
    }
    setIndexToAdjustAdvice(null);
    setPickedAdvice(advice);
  };

  const pickEffectIndex = (index: number) => {
    setIndexToAdjustAdvice(index);
  };

  const elixirFuncs = [
    regulateWeightThisTime,
    regulateWeightAllTime,
    regulateWeightThisTime,
    regulateWeightAllTime,
    snipeEffect,
    snipeEffectUseRoundTwo,
    gaugeTwoThisTime,
    gaugeThreeThisTimeUseRoundTwo,
    magicDoubleEffects,
    magicTripleEffects,
  ];

  const adaptAdvice = () => {
    if (pickedAdvice === null) {
      //TODO : advice 안골랐을때 notice 주기
      return;
    }

    if (pickedAdvice.target === 'pick' && indexToAdjustAdvice === null) {
      //TODO : effect 안골랐을때 notice 주기
      return;
    }

    elixirFuncs[pickedAdvice.adviceNum]();

    // 이후 처리
    setIsUserSelectAdvice(true);
  };

  const executeMagic = () => {
    const copiedEffects = JSON.parse(JSON.stringify(pickedEffects));
    const newPickedEffects =
      simulEffectCount === 1
        ? pickEffectToUpdate(copiedEffects, gaugeUpdateCount)
        : pickEffectToUpdateSimultaneously(copiedEffects, simulEffectCount);

    if (onlyThisTime.current) {
      //이번 연성~ 은 확률 다시 되돌리기
      setPickedEffects(
        newPickedEffects.map((effect, index) => ({
          ...effect,
          pickWeight: lastPickedEffects[index].pickWeight,
          greatWeight: lastPickedEffects[index].greatWeight,
        })),
      );
      setLastPickedEffects([]);
      onlyThisTime.current = false;
    } else {
      setPickedEffects(newPickedEffects);
    }

    getProposedAdvices(basicAdvices);
    setRound(round + roundRemoveCount);

    // 이후 초기화 처리
    setIsUserSelectAdvice(false);
    setPickedAdvice(null);
    setIndexToAdjustAdvice(null);
    setGaugeUpdateCount(1);
    setRoundRemoveCount(1);
    setSimulEffectCount(1);
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
    indexToAdjustAdvice,
    pickEffectIndex,
    getOtherAdvices,
    otherAdvicesCount,
  };
};
export default useElixir;

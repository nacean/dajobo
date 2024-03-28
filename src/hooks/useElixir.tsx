import { BasicAdvice } from '@src/types/basicAdvice';
import { Effect } from '@src/types/effect';
import { ParseResult } from 'papaparse';
import Chooser from 'random-seed-weighted-chooser';
import { useCallback, useEffect, useState } from 'react';
import { usePapaParse } from 'react-papaparse';

const useElixir = () => {
  const [effects, setEffects] = useState<Effect[]>([]); // 효과 전체
  const [proposedEffects, setProposedEffects] = useState<Effect[]>([]); // 초반 제안 3가지 효과
  const [pickedEffects, setPickedEffects] = useState<Effect[]>([]); // 내가 뽑은 효과(총 5개)

  const [basicAdvices, setBasicAdvices] = useState<BasicAdvice[]>([]); // 기초 조언 전체
  const [proposedAdvices, setProposedAdvices] = useState<BasicAdvice[]>([]); // 현자가 제안하는 조언 3가지

  const [round, setRound] = useState(0); // 몇번째 정재인지 (기본은 0~13까지 가능)

  const { readString } = usePapaParse();

  const getProposedEffects = useCallback((effects: Effect[]) => {
    if (effects.length === 0) {
      return;
    }

    const newEffectsToUpdate: Effect[] = [];

    for (let i = 0; i < 3; i++) {
      const newEffect = Chooser.chooseWeightedObject(effects) as Effect;
      newEffectsToUpdate.push(newEffect);
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
    const newPickedEffects = [...pickedEffects, effect];
    setPickedEffects(newPickedEffects);

    getProposedEffects(effects);
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
    //TODO : advice 구현
    getProposedAdvices(basicAdvices);
    setRound(round + 1);
  };

  useEffect(() => {
    getAllEffects();
    getAllBasicAdvices();
  }, [getAllBasicAdvices, getAllEffects]);

  return { proposedEffects, pickedEffects, pickEffect, proposedAdvices, pickAdvice, round };
};
export default useElixir;

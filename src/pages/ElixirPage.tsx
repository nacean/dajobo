import { Button } from '@mui/material';
import { usePapaParse } from 'react-papaparse';

import Advice from '@src/components/elixir/advice/Advice';
import EffectList from '@src/components/elixir/effects/EffectList';
import { createStyles } from '@src/styles/utils';
import { useCallback, useEffect, useState } from 'react';
import Chooser from 'random-seed-weighted-chooser';
import { Effect } from '@src/types/effect';
import { ParseResult } from 'papaparse';

const ElixirPage = () => {
  const [effects, setEffects] = useState<Effect[]>([]);
  const [newEffects, setNewEffects] = useState<Effect[]>([]);
  const [pickedEffects, setPickedEffects] = useState<Effect[]>([]);
  const { readString } = usePapaParse();

  const getNewEffects = useCallback((effects: Effect[]) => {
    if (effects.length === 0) {
      return;
    }

    const newEffectsToUpdate: Effect[] = [];

    for (let i = 0; i < 3; i++) {
      const newEffect = Chooser.chooseWeightedObject(effects) as Effect;
      newEffectsToUpdate.push(newEffect);
    }

    setNewEffects(newEffectsToUpdate);
  }, []);

  const initNewEffects = useCallback(async () => {
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
        getNewEffects(refinedEffects);
      },
    });
  }, [getNewEffects, readString]);

  const pickEffect = (effect: Effect) => {
    setPickedEffects([...pickedEffects, effect]);
    getNewEffects(effects);
  };

  useEffect(() => {
    initNewEffects();
  }, [initNewEffects]);

  if (effects.length === 0) {
    return <div>loading...</div>;
  }

  return (
    <div css={styles.container}>
      <div css={styles.upperContainer}>
        <div css={styles.advicePickContainer}>
          {newEffects.map(effect => (
            <Advice effect={effect} pickEffect={pickEffect} />
          ))}
        </div>
        <EffectList pickedEffects={pickedEffects} />
      </div>
      <div css={styles.selectButtonContainer}>
        <div>연성 n회 가능</div>
        <Button variant="contained" css={styles.selectButton}>
          효과정제
        </Button>
      </div>
    </div>
  );
};

const styles = createStyles({
  container: {
    border: '1px solid black',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 48,
  },
  upperContainer: {
    minHeight: 512,
    display: 'flex',
    justifyContent: 'space-between',
    paddingInline: 48,
  },
  advicePickContainer: {
    border: '1px solid black',
    width: '65%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  selectButtonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  selectButton: {
    width: 256,
    height: 52,
    fontSize: 20,
  },
});

export default ElixirPage;

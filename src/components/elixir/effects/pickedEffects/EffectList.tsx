import { Button, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import PickedEffect from '@src/components/elixir/effects/pickedEffects/PickedEffect';
import { createStyles } from '@src/utils/utils';
import { Effect } from '@src/types/effect';
import { FC } from 'react';
import { BasicAdvice } from '@src/types/basicAdvice';

interface Props {
  pickedEffects: Effect[];
  pickedAdvice: BasicAdvice | null;
  indexToAdjustAdvice: number | null;
  pickEffectIndex: (index: number) => void;
}

//TODO : 다조보 파일 위치 추후 변경 필요하면 변경
const EffectList: FC<Props> = ({
  pickedEffects,
  pickedAdvice,
  indexToAdjustAdvice,
  pickEffectIndex,
}) => {
  const handleEffectToAdjustChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pickEffectIndex(Number(event.target.value));
  };

  return (
    <div css={styles.effectListContainer}>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={indexToAdjustAdvice}
        onChange={handleEffectToAdjustChange}
        css={styles.effects}
      >
        {pickedEffects.map((pickedEffect, index) => (
          <FormControlLabel
            value={index}
            control={<Radio disabled={pickedAdvice?.target !== 'pick'} />}
            label={
              <PickedEffect pickedEffect={pickedEffect} key={pickedEffect.effectName + index} />
            }
          />
        ))}
      </RadioGroup>
      <Button variant="contained" css={styles.anotherAdviceButton} fullWidth>
        다른 조언 보기
      </Button>
    </div>
  );
};

const styles = createStyles({
  effectListContainer: {
    width: '25%',
    border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    paddingInline: 8,
    paddingBlock: 12,
  },
  effects: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  effect: {
    display: 'flex',
    alignItems: 'center',
    width: '90%',
    height: 60,
    padding: 12,
  },
  anotherAdviceButton: {
    height: 52,
    fontSize: 20,
  },
});

export default EffectList;

import { Paper } from '@mui/material';
import EffectGauge from '@src/components/elixir/effects/pickedEffects/EffectGauge';
import { createStyles } from '@src/utils/utils';
import { Effect } from '@src/types/effect';
import { getEffectLevel, getPercentageFromWeight } from '@src/utils/effectUtils';
import { FC } from 'react';

interface Props {
  pickedEffect: Effect;
}

const PickedEffect: FC<Props> = ({ pickedEffect }) => {
  return (
    <div css={styles.container}>
      <div css={styles.probability}>
        {pickedEffect.isLocked ? '봉인' : getPercentageFromWeight(pickedEffect.pickWeight)}
      </div>
      <Paper elevation={2} css={styles.PickedEffect}>
        <div css={styles.basicInfoContainer}>
          <div css={styles.levelAndName}>
            <div>{`Lv.${getEffectLevel(pickedEffect.gauge)}`}</div>
            <div>{pickedEffect.effectName}</div>
          </div>
          <div>{`(${pickedEffect.typeName})`}</div>
        </div>
        <EffectGauge gauge={pickedEffect.gauge} />
        <div
          css={styles.greatProbability}
        >{`대성공: ${getPercentageFromWeight(pickedEffect.greatWeight)}`}</div>
      </Paper>
    </div>
  );
};

const styles = createStyles({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  probability: {
    flexShrink: 0,
    width: 64,
    height: 64,
    border: '1px solid black',
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicInfoContainer: {
    width: '100%',
    display: 'flex',
    gap: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelAndName: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  greatProbability: {
    display: 'flex',
    justifyContent: 'end',
  },
  PickedEffect: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '90%',
    height: 72,
    padding: 12,
  },
});

export default PickedEffect;

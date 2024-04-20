import { Button } from '@mui/material';
import { createStyles } from '@src/utils/utils';
import { Effect } from '@src/types/effect';
import { FC } from 'react';

interface Props {
  effect: Effect;
  pickEffect: (effect: Effect) => void;
}

const InitEffect: FC<Props> = ({ effect, pickEffect }) => {
  return (
    <div css={styles.container}>
      <div css={styles.emptyContainer}></div>
      <Button
        variant="outlined"
        color="info"
        css={styles.effect}
        onClick={() => {
          pickEffect(effect);
        }}
      >
        {`${effect.effectName} 효과를 정제하는건 어때요? \n (${effect.typeName})`}
      </Button>
    </div>
  );
};

const styles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  emptyContainer: {
    height: 30,
  },
  stack: {
    border: '1px solid black',
    borderRadius: '50%',
    padding: 12,
  },
  effect: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 310,
    height: 72,
    padding: 12,
    whiteSpace: 'pre-wrap',
  },
});

export default InitEffect;

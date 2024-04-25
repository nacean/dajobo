import { Button } from '@mui/material';
import { createStyles } from '@src/utils/utils';
import { AdviceType } from '@src/types/basicAdvice';
import { FC, useCallback } from 'react';
import { Effect } from '@src/types/effect';

interface Props {
  advice: AdviceType;
  pickAdvice: (advice: AdviceType) => void;
  isPicked: boolean;
  pickedEffects: Effect[];
  lawStack: number;
}

const Advice: FC<Props> = ({ advice, pickAdvice, isPicked, pickedEffects, lawStack }) => {
  let refinedExplain = advice.explain;

  pickedEffects.forEach((effect, index) => {
    refinedExplain = refinedExplain.replace(`{${index}}`, `"${effect.effectName}"`);
  });

  const getStacks = useCallback(() => {
    const stacks: JSX.Element[] = [];

    if (lawStack > 0) {
      for (let i = 0; i < 3; i++) {
        stacks.push(
          <div
            css={styles.stack}
            style={{ backgroundColor: i < lawStack ? '#2962ff' : undefined }}
          />,
        );
      }
    }

    return <div css={styles.stackContainer}>{stacks}</div>;
  }, [lawStack]);

  return (
    <div css={styles.container}>
      {getStacks()}
      <Button
        variant="outlined"
        color="info"
        css={styles.advice}
        style={{
          outline: isPicked ? '2px solid red' : undefined,
          backgroundColor: lawStack === 3 ? '#2962ff' : undefined,
          color: lawStack === 3 ? '#fff' : undefined,
        }}
        onClick={() => {
          pickAdvice(advice);
        }}
      >
        {refinedExplain}
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
  stackContainer: {
    height: 30,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  stack: {
    border: '1px solid black',
    borderRadius: '50%',
    padding: 12,
  },
  advice: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 310,
    height: 72,
    padding: 12,
    whiteSpace: 'pre-wrap',
  },
});

export default Advice;

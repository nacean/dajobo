import { Button } from '@mui/material';
import { createStyles } from '@src/utils/utils';
import { BasicAdvice } from '@src/types/basicAdvice';
import { FC } from 'react';

interface Props {
  advice: BasicAdvice;
  pickAdvice: (advice: BasicAdvice) => void;
}

const Advice: FC<Props> = ({ advice, pickAdvice }) => {
  return (
    <div css={styles.container}>
      <div css={styles.stackContainer}>
        <div css={styles.stack} />
        <div css={styles.stack} />
        <div css={styles.stack} />
      </div>
      <Button
        variant="outlined"
        color="info"
        css={styles.advice}
        onClick={() => {
          pickAdvice(advice);
        }}
      >
        {advice.explain}
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

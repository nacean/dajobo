import { Button } from '@mui/material';
import { createStyles } from '@src/styles/utils';

const Advice = () => {
  return (
    <div css={styles.container}>
      <div css={styles.stackContainer}>
        <div css={styles.stack} />
        <div css={styles.stack} />
        <div css={styles.stack} />
      </div>
      <Button variant="outlined" color="info" css={styles.advice}>
        이대론 안되겠어. 엘릭서의 효과와 단계를 초기화하겠네.
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
  },
});

export default Advice;

import { Button, Paper } from '@mui/material';
import { createStyles } from '@src/styles/utils';

const ElixirPage = () => {
  return (
    <div css={styles.container}>
      <div css={styles.upperContainer}>
        <div css={styles.advicePickContainer}>
          <Paper elevation={3} css={styles.advice}>
            마법 방어력
          </Paper>
          <Paper elevation={3} css={styles.advice}>
            회심
          </Paper>
          <Paper elevation={3} css={styles.advice}>
            공격력
          </Paper>
        </div>
        <div css={styles.effectListContainer}>
          <div css={styles.effects}>
            <Paper elevation={2} css={styles.effect}>
              정제 필요
            </Paper>
            <Paper elevation={2} css={styles.effect}>
              정제 필요
            </Paper>
            <Paper elevation={2} css={styles.effect}>
              정제 필요
            </Paper>
            <Paper elevation={2} css={styles.effect}>
              정제 필요
            </Paper>
            <Paper elevation={2} css={styles.effect}>
              정제 필요
            </Paper>
          </div>
          <Button variant="contained" css={styles.anotherAdviceButton} fullWidth>
            다른 조언 보기
          </Button>
        </div>
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
  advice: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 310,
    height: 40,
    padding: 12,
  },
  effectListContainer: {
    width: '25%',
    border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    paddingInline: 8,
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

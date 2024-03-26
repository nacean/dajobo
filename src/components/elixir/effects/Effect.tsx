import { Paper } from '@mui/material';
import { createStyles } from '@src/styles/utils';

const Effect = () => {
  return (
    <div css={styles.container}>
      <div css={styles.probability}>12.8%</div>
      <Paper elevation={2} css={styles.effect}>
        <div css={styles.levelAndName}>
          <div>Lv.0</div>
          <div>회심</div>
        </div>
        <div css={styles.guageContainer}>
          <div css={styles.guage} />
          <div css={styles.guage} />
          <div css={styles.guage} />
          <div css={styles.guage} />
          <div css={styles.guage} />
          <div css={styles.guage} />
          <div css={styles.guage} />
          <div css={styles.guage} />
          <div css={styles.guage} />
          <div css={styles.guage} />
        </div>
        <div css={styles.greatProbability}>10.0%</div>
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
  levelAndName: {
    width: '100%',
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  guageContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  guage: {
    border: '1px solid black',
    width: 20,
    height: 20,
  },
  greatProbability: {
    display: 'flex',
    justifyContent: 'end',
  },
  effect: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '90%',
    height: 72,
    padding: 12,
  },
});

export default Effect;

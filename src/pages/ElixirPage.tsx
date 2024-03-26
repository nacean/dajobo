import { Button } from '@mui/material';
import Advice from '@src/components/elixir/advice/Advice';
import EffectList from '@src/components/elixir/effects/EffectList';
import { createStyles } from '@src/styles/utils';

const ElixirPage = () => {
  return (
    <div css={styles.container}>
      <div css={styles.upperContainer}>
        <div css={styles.advicePickContainer}>
          <Advice />
          <Advice />
          <Advice />
        </div>
        <EffectList />
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

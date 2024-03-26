import { Button } from '@mui/material';
import Effect from '@src/components/elixir/effects/Effect';
import { createStyles } from '@src/styles/utils';

//TODO : 다조보 파일 위치 추후 변경 필요하면 변경
const EffectList = () => {
  return (
    <div css={styles.effectListContainer}>
      <div css={styles.effects}>
        <Effect />
        <Effect />
        <Effect />
        <Effect />
        <Effect />
      </div>
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

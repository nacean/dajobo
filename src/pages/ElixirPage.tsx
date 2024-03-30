import { Button } from '@mui/material';

import Advice from '@src/components/elixir/advice/Advice';
import InitEffect from '@src/components/elixir/effects/InitEffect';
import EffectList from '@src/components/elixir/effects/pickedEffects/EffectList';
import useElixir from '@src/hooks/useElixir';
import { createStyles } from '@src/utils/utils';

const ElixirPage = () => {
  const {
    proposedEffects,
    pickedEffects,
    pickEffect,
    proposedAdvices,
    pickAdvice,
    round,
    adaptAdvice,
    executeMagic,
    isUserSelectAdvice,
    pickedAdvice,
    indexToAdjustAdvice,
    pickEffectIndex,
    getOtherAdvices,
    otherAdvicesCount,
  } = useElixir();

  const clickAdaptOrExecuteButton = () => {
    if (isUserSelectAdvice) {
      executeMagic();
    } else {
      adaptAdvice();
    }
  };

  if (proposedEffects.length === 0) {
    return <div>loading...</div>;
  }

  return (
    <div css={styles.container}>
      <div css={styles.upperContainer}>
        <div css={styles.advicePickContainer}>
          {pickedEffects.length === 5
            ? proposedAdvices.map((advice, index) => (
                <Advice
                  advice={advice}
                  pickAdvice={pickAdvice}
                  key={advice.explain + index}
                  isPicked={advice === pickedAdvice}
                />
              ))
            : proposedEffects.map((effect, index) => (
                <InitEffect
                  effect={effect}
                  pickEffect={pickEffect}
                  key={effect.effectName + index}
                />
              ))}
        </div>
        <div css={styles.upperRightContainer}>
          <EffectList
            pickedEffects={pickedEffects}
            pickedAdvice={pickedAdvice}
            indexToAdjustAdvice={indexToAdjustAdvice}
            pickEffectIndex={pickEffectIndex}
          />
          <Button
            disabled={!otherAdvicesCount}
            variant="contained"
            css={styles.anotherAdviceButton}
            fullWidth
            onClick={getOtherAdvices}
          >
            {`다른 조언 보기(${otherAdvicesCount}회 가능)`}
          </Button>
        </div>
      </div>
      {pickedEffects.length === 5 && (
        <div css={styles.selectButtonContainer}>
          <div>{`연성 ${14 - round}회 가능`}</div>
          <Button variant="contained" css={styles.selectButton} onClick={clickAdaptOrExecuteButton}>
            {isUserSelectAdvice ? '정제하기' : '조언 선택'}
          </Button>
        </div>
      )}
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
  upperRightContainer: {
    width: '25%',
    minHeight: 512,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  advicePickContainer: {
    height: 680,
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
  anotherAdviceButton: {
    height: 52,
    fontSize: 20,
  },
});

export default ElixirPage;

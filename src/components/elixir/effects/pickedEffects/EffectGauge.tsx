import { createStyles } from '@src/utils/utils';
import { FC } from 'react';

interface Props {
  gauge: number;
}

const EffectGauge: FC<Props> = ({ gauge }) => {
  const gaugeArray = [0, 0, 1, 0, 0, 2, 0, 3, 4, 5];

  const defineBackgroundColor = (index: number) => {
    if (gauge === 10) {
      return 'red';
    } else if (index + 1 <= gauge) {
      return 'yellow';
    } else {
      return 'none';
    }
  };

  return (
    <div css={styles.gaugeContainer}>
      {gaugeArray.map((num, index) => (
        <div css={styles.gauge} style={{ backgroundColor: defineBackgroundColor(index) }}>
          {num !== 0 && num}
        </div>
      ))}
    </div>
  );
};

const styles = createStyles({
  gaugeContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  gauge: {
    border: '1px solid black',
    width: 20,
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EffectGauge;

import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CardMarkModel } from '../../apiTypes';
import { DimAnim } from '../DimAnim/DimAnim';

const circleSize = 100;

const styles = StyleSheet.create({
  circle: {
    marginTop: 20,
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: '#fff',
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mark: {
    width: 45,
    height: 45,
    elevation: 4,
  },
});

interface CardMarkProps {
  markData: CardMarkModel | undefined;
  onMarkClick: () => void;
  color: string;
  isDimOn: boolean;
}
const CardMark = ({ onMarkClick, markData, color, isDimOn }: CardMarkProps) => {
  return (
    <TouchableOpacity onPress={onMarkClick} disabled={markData?.is_marked}>
      <DimAnim style={styles.circle} startColor={color} isDimOn={isDimOn}>
        {markData?.is_marked && (
          <Image
            source={require('../../../assets/coffeeBeanIcon.png')}
            style={styles.mark}
          />
        )}
      </DimAnim>
    </TouchableOpacity>
  );
};

export default CardMark;

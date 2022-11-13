import React, { useRef } from 'react';
import { useEffect } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface DimAnimProps {
  style?: ViewStyle;
  startColor: string;
  isDimOn: boolean;
  dimPercentage?: number;
  children: React.ReactNode;
}

export const DimAnim = ({
  style,
  startColor,
  isDimOn,
  dimPercentage = 30,
  children,
}: DimAnimProps) => {
  useEffect(() => {
    Animated.timing(animatedRef, {
      useNativeDriver: false,
      toValue: isDimOn ? 1 : 0,
      duration: 300,
    }).start();
  }, [isDimOn]);

  const getNumberFromHex = (hex) => {
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      let c = hex.substring(1).split('');
      if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      c = '0x' + c.join('');
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
    }
    throw new Error('Bad Hex');
  };

  const calcPercentage = (num, percentage) => (num * percentage) / 100;

  const dimRgbColor = (colors) =>
    colors.map((color) => Number(color) - calcPercentage(color, dimPercentage));

  const generateRgb = (colors) => 'rgba(' + colors.join(',') + ',1)';

  const animatedRef = useRef(new Animated.Value(0)).current;
  const boxInterpolation = animatedRef.interpolate({
    inputRange: [0, 1],
    outputRange: [
      generateRgb(getNumberFromHex(startColor)),
      generateRgb(dimRgbColor(getNumberFromHex(startColor))),
    ],
  });
  const animatedStyle = {
    backgroundColor: boxInterpolation,
  };
  return <Animated.View style={[style, { ...animatedStyle }]}>{children}</Animated.View>;
};

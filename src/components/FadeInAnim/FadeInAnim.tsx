import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface FadeInAnimProps {
  start: boolean;
  duration?: number;
  children: React.ReactNode;
  style?: StyleSheet;
}

export const FadeInAnim = ({
  start,
  duration = 500,
  children,
  style,
}: FadeInAnimProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: start ? 1 : 0,
      duration: duration,
    }).start();
  }, [start]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {children}
    </Animated.View>
  );
};

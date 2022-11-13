import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top: Dimensions.get('window').height,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

interface SlideInAnimProps {
  children: React.ReactNode;
  open: boolean;
}
export const SlideInAnim = ({ children, open }: SlideInAnimProps) => {
  const [offLoadComponent, setOffloadComponent] = useState<boolean>(false);
  const slideRef = useRef(new Animated.Value(0)).current;

  const slideAnim = (isSlideIn: boolean) => {
    Animated.timing(slideRef, {
      toValue: isSlideIn ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (!isSlideIn) setOffloadComponent(true);
    });
  };
  useEffect(() => {
    setOffloadComponent(false);
    slideAnim(open);
  }, [open]);

  const slideUp = {
    transform: [
      {
        translateY: slideRef.interpolate({
          inputRange: [0.01, 1],
          outputRange: [0, -1 * Dimensions.get('window').height],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return offLoadComponent ? null : (
    <View style={styles.sheet}>
      <Animated.View style={slideUp}>{children}</Animated.View>
    </View>
  );
};

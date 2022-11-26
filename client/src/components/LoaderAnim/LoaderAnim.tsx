import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { FadeInAnim } from '../FadeInAnim/FadeInAnim';

const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  msg: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

interface LoaderAnimProps {
  msg?: string;
  width?: number;
  height?: number;
  visible: boolean;
}
export const LoaderAnim = ({ msg, width, height, visible }: LoaderAnimProps) => {
  return !visible ? null : (
    <FadeInAnim start={visible}>
      <View style={styles.loader}>
        <Image
          source={require('../../../assets/loader.gif')}
          style={{ width: width ? width : 100, height: height ? height : 100 }}
        />
        <Text style={styles.msg}>{msg}</Text>
      </View>
    </FadeInAnim>
  );
};

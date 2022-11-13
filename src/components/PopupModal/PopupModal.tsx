import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SlideInAnim } from '../SlideInAnim/SlideInAnim';
import { FadeInAnim } from '../FadeInAnim/FadeInAnim';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 352,
    height: 380,
    borderRadius: 35,
    shadowColor: 'gray',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    paddingTop: 25,
    bottom: 200,
  },
});
interface PopupModalProps {
  open: boolean;
  children: React.ReactNode;
}
export const PopupModal = ({ open, children }: PopupModalProps) => {
  return (
    <SlideInAnim open={open}>
      <FadeInAnim start={open} duration={300}>
        <View style={styles.container}>{children}</View>
      </FadeInAnim>
    </SlideInAnim>
  );
};

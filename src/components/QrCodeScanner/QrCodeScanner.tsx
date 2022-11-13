import { Camera, BarCodeScanningResult } from 'expo-camera';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { FadeInAnim } from '../FadeInAnim/FadeInAnim';
import { LoaderAnim } from '../LoaderAnim/LoaderAnim';

const styles = StyleSheet.create({
  camera: {
    height: 329,
    width: 299,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface QrCodeScannerProps {
  isCameraOpen: boolean;
  isCameraReady: boolean;
  setIsCameraReady: (a: boolean) => void;
  onBarcodeScanSuccess: (data: BarCodeScanningResult) => Promise<void>;
}

const QrCodeScanner = ({
  isCameraOpen,
  isCameraReady,
  setIsCameraReady,
  onBarcodeScanSuccess,
}: QrCodeScannerProps) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.camera}>
      <View>
        <FadeInAnim start={!isCameraReady}>
          <LoaderAnim visible={!isCameraReady} />
        </FadeInAnim>
        <FadeInAnim start={isCameraReady}>
          {isCameraOpen && (
            <Camera
              style={styles.camera}
              onBarCodeScanned={onBarcodeScanSuccess}
              onCameraReady={() => setIsCameraReady(true)}
            >
              <Image source={require('../../../assets/cameraGuidelines.png')} />
            </Camera>
          )}
        </FadeInAnim>
      </View>
    </View>
  );
};
export default QrCodeScanner;

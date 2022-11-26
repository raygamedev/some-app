// import { Camera } from 'expo-camera';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
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
  onBarcodeScanSuccess: (data: BarCodeScannerResult) => Promise<void>;
}

const QrCodeScanner = ({
  isCameraOpen,
  isCameraReady,
  setIsCameraReady,
  onBarcodeScanSuccess,
}: QrCodeScannerProps) => {
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    void getBarCodeScannerPermissions();
  }, []);

  if (hasPermission === null || hasPermission === false)
    return <Text>Please enable camera permissions via Settings</Text>;

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

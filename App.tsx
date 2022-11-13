import React from 'react';
import { Text } from 'react-native';
import { CardScreen } from './src/apps/NahatMobileApp/screens/CardScreen';
import { BarcodeScreen } from './src/apps/NahatClientApp/screens/BarcodeScreen';
import { useServer } from './src/hooks';
import { LoaderAnim } from './src/components/LoaderAnim/LoaderAnim';
import { Env, AppVariants } from './Env';
import { PopupModal } from './src/components/PopupModal/PopupModal';

console.log(Env);

const NahatMobileApp = () => {
  return <CardScreen />;
};

const NahatClientApp = () => {
  return <BarcodeScreen />;
};

const getApp = () => {
  if (Env.APP_VARIANT === AppVariants.NahatClient) {
    return NahatClientApp();
  } else if (Env.APP_VARIANT === AppVariants.NahatMobile) {
    return NahatMobileApp();
  }
  return (
    <PopupModal open={true}>
      <Text>ERROR Loading Apps</Text>
    </PopupModal>
  );
};

const App = () => {
  const serverIsAlive = useServer();
  return serverIsAlive ? getApp() : <LoaderAnim visible={true} />;
};

export default App;

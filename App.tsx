import React from "react";
import { Text } from "react-native";
import { CardScreen } from "./src/apps/SomeMobile/screens/CardScreen";
import { BarcodeScreen } from "./src/apps/SomeClient/screens/BarcodeScreen";
import { useServer } from "./src/hooks";
import { LoaderAnim } from "./src/components/LoaderAnim/LoaderAnim";
import { Env, AppVariants } from "./Env";
import { PopupModal } from "./src/components/PopupModal/PopupModal";

console.log(Env);

const SomeMobile = () => {
  return <CardScreen />;
};

const SomeClient = () => {
  return <BarcodeScreen />;
};

const getApp = () => {
  if (Env.APP_VARIANT === AppVariants.SomeClient) {
    return SomeClient();
  } else if (Env.APP_VARIANT === AppVariants.SomeMobile) {
    return SomeMobile();
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

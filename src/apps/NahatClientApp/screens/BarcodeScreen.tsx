import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, Button, View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { Env } from '../../../../Env';
import { LoaderAnim } from '../../../components/LoaderAnim/LoaderAnim';
import { FadeInAnim } from '../../../components/FadeInAnim/FadeInAnim';
import { PopupModal } from '../../../components/PopupModal/PopupModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const windowWidth = Dimensions.get('window').width;
const barcodeSize = Dimensions.get('window').width > 500 ? 500 : windowWidth;
const WebsocketURL = `${Env.WS_URL}/ws/nahat_client`;
const CoffeeBeenIcon = '../../../../assets/coffeeBeanIcon.png';

export const BarcodeScreen = () => {
  const [currentUuid, setCurrentUuid] = useState<string | undefined>();
  const [socketUrl] = useState<string>(WebsocketURL);
  const [redeemCardPopup, setRedeemCardPopup] = useState<boolean>(false);
  const [redeemCardPopupText, setRedeemCardPopupText] = useState<string>('');
  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl, {
    retryOnError: true,
    reconnectInterval: 1000,
  });

  useEffect(() => {
    const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    console.log('socketUrl: ' + socketUrl);
    console.log('connectionStatus: ' + connectionStatus);
  }, [socketUrl, readyState]);

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage);
      const data = JSON.parse(lastMessage.data);
      if (data.status) {
        sendMessage(JSON.stringify({ status: 'ok' }));
      } else if (data.barcode) {
        console.log('Received barcode: ' + data.barcode);
        setCurrentUuid(data.barcode);
      } else if (data.redeem) {
        setRedeemCardPopupText(data.redeem);
        setRedeemCardPopup(true);
      } else {
        console.log(data);
      }
    }
  }, [lastMessage]);
  const handleRedeemCardPopupClose = () => {
    setRedeemCardPopup(false);
    sendMessage(JSON.stringify({ redeem: 'ok' }));
  };

  const getCardCodeRepresentation = () => {
    return redeemCardPopupText.slice(0, 3) + '-' + redeemCardPopupText.slice(3, 6);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FadeInAnim start={true}>
        {currentUuid ? (
          <QRCode
            value={currentUuid}
            size={barcodeSize}
            logo={require(CoffeeBeenIcon)}
            logoSize={60}
            logoMargin={2}
            logoBorderRadius={15}
            logoBackgroundColor="white"
          />
        ) : (
          <LoaderAnim visible={true} />
        )}
      </FadeInAnim>
      <PopupModal open={redeemCardPopup}>
        <View style={[styles.container, { justifyContent: 'space-evenly' }]}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
            {getCardCodeRepresentation()}
          </Text>
          <Button title={'REDEEM'} onPress={handleRedeemCardPopupClose} />
        </View>
      </PopupModal>
    </SafeAreaView>
  );
};

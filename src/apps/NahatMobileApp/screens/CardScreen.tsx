import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Button,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';

import { handleAppLaunch } from '../../../components/UserAuth/UserAuth';
import QrCodeScanner from '../../../components/QrCodeScanner/QrCodeScanner';
import {
  apiGenerateCard,
  apiGetUserCard,
  apiPublishBarcode,
  apiRedeemCard,
} from '../../../api';
import { CardMarkModel } from '../../../apiTypes';
import CardMark from '../../../components/CardMark/CardMark';
import _ from 'lodash';
import { SlideInAnim } from '../../../components/SlideInAnim/SlideInAnim';
import { CardColor } from '../../../apiTypes';
import { BarCodeScanningResult } from 'expo-camera';
import { DimAnim } from '../../../components/DimAnim/DimAnim';
import { FadeInAnim } from '../../../components/FadeInAnim/FadeInAnim';
import { PopupModal } from '../../../components/PopupModal/PopupModal';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 100,
    top: 100,
    resizeMode: 'contain',
  },
  card: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#78ad79',
    width: 300,
    height: 500,
    borderRadius: 15,
    bottom: 50,
    shadowColor: 'gray',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  redeemPopup: {
    padding: 10,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  closeButton: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
const availableCardColors: CardColor[] = [
  { background: '#EAAB7E', mark_area: '#F1C9AD' },
  { background: '#A25E58', mark_area: '#C2827C' },
  { background: '#7F946C', mark_area: '#ABC296' },
  { background: '#CFC4AC', mark_area: '#DFD0AE' },
  { background: '#9EA779', mark_area: '#D2DAB4' },
  { background: '#7B9091', mark_area: '#A5BABB' },
  { background: '#AA9664', mark_area: '#C6B99A' },
  { background: '#BBA6BE', mark_area: '#DDC7E0' },
  { background: '#CA9C97', mark_area: '#EAC6C2' },
];

export const CardScreen = () => {
  const [userGuid, setUserGuid] = useState<string>('');
  const [markIndex, setMarkIndex] = useState<number>(-1);
  const [cardMarks, setCardMarks] = useState<CardMarkModel[]>(Array.from(Array(8)));
  const [cardColor, setCardColor] = useState<CardColor>();
  const [cardCode, setCardCode] = useState<string>();
  const [isCardRedeemable, setIsCardRedeemable] = useState<boolean>(false);
  const [isBarcodeScanningLock, setIsBarcodeScanningLock] = useState<boolean>(false);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isDimOn, setIsDimOn] = useState<boolean>(false);
  const [openCameraPopup, setOpenCameraPopup] = useState<boolean>(false);
  const [openRedeemPopup, setOpenRedeemPopup] = useState<boolean>(false);

  useEffect(() => {
    const getCardData = async () => {
      const guid = await handleAppLaunch();
      if (guid != null) {
        setUserGuid(guid);
        let card = (await apiGetUserCard(guid)) || (await apiGenerateCard(guid));
        if (card === null) {
          card = await apiGenerateCard(guid);
        }
        if (card === null) return;
        updateCardMarks(card.marks);
        console.log(card.code);
        setCardCode(card.code);
        setCardColor(card.colors);
      }
    };
    void getCardData();
  }, []);

  useEffect(
    () => setIsDimOn(openCameraPopup || openRedeemPopup),
    [openCameraPopup, openRedeemPopup]
  );

  const updateCardMarks = (marks: CardMarkModel[] | undefined) => {
    if (!marks) return;
    const temp = _.cloneDeep(cardMarks);
    marks.forEach((mark, idx) => {
      temp[mark.index] = mark;
      if (idx === 7) {
        setIsCardRedeemable(true); // TODO move to backend
      }
    });
    setCardMarks(temp);
  };

  const openCameraHandler = (markIdx: number) => {
    setOpenCameraPopup(true);
    setMarkIndex(markIdx);
  };

  const onBarcodeScanSuccess = async ({ data }: BarCodeScanningResult): Promise<void> => {
    setIsBarcodeScanningLock(true);
    setIsCameraReady(false);
    if (isBarcodeScanningLock) return;
    if (userGuid && data && !isNaN(markIndex)) {
      const mark: CardMarkModel = {
        is_marked: true,
        index: markIndex,
        barcode: data,
        position: { x: 0, y: 0 }, //todo remove
      };
      updateCardMarks(await apiPublishBarcode(userGuid, mark));
      setIsBarcodeScanningLock(false);
      setOpenCameraPopup(false);
    }
  };

  const redeemCardHandler = async () => {
    setOpenRedeemPopup(true);
    const isRedeemed = await apiRedeemCard(userGuid);
    console.log(isRedeemed);
    if (isRedeemed) {
      const card = await apiGenerateCard(userGuid);
      if (card === null) return;
      setCardMarks(Array.from(Array(8)));
      setCardColor(card.colors);
      setCardCode(card.code);
      setOpenRedeemPopup(false);
      setIsCardRedeemable(false)
    }
  };

  const closeButtonHandler = () => {
    if (openRedeemPopup) setOpenRedeemPopup(false);
    if (openCameraPopup) setOpenCameraPopup(false);
  };
  const getCardCodeRepresentation = () => {
    if (!cardCode) return;
    return cardCode.slice(0, 3) + '-' + cardCode.slice(3, 6);
  };

  return (
    <DimAnim style={styles.mainContainer} isDimOn={isDimOn} startColor={'#fff'}>
      <FadeInAnim start={true} duration={1000}>
        <View style={styles.container}>
          <Image
            source={require('../../../../assets/nahatLogo.png')}
            style={styles.image}
          />
        </View>
      </FadeInAnim>
      <TouchableOpacity
        style={{
          position: 'absolute',
          width: '100%',
          height: '53%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={closeButtonHandler}
        disabled={!isDimOn}
      >
        <FadeInAnim start={isDimOn} duration={150}>
          <Image
            source={require('../../../../assets/close-button.png')}
            style={styles.closeButton}
          />
        </FadeInAnim>
      </TouchableOpacity>
      {!!cardColor && (
        <SlideInAnim open={true}>
          <DimAnim
            style={styles.card}
            startColor={cardColor.background}
            isDimOn={isDimOn}
          >
            {cardMarks.map((mark, idx) => {
              return (
                <CardMark
                  markData={mark}
                  key={idx}
                  color={cardColor.mark_area || '#FFF'}
                  onMarkClick={() => openCameraHandler(idx)}
                  isDimOn={isDimOn}
                />
              );
            })}
          </DimAnim>
          <View style={{ bottom: 30 }}>
            <Button
              title={'REDEEM TOKEN'}
              disabled={!isCardRedeemable}
              onPress={redeemCardHandler}
            />
          </View>
        </SlideInAnim>
      )}

      <PopupModal open={openCameraPopup}>
        <QrCodeScanner
          isCameraReady={isCameraReady}
          setIsCameraReady={setIsCameraReady}
          onBarcodeScanSuccess={onBarcodeScanSuccess}
          isCameraOpen={openCameraPopup}
        />
      </PopupModal>
      <PopupModal open={openRedeemPopup}>
        <View style={styles.redeemPopup}>
          <Text style={{ fontSize: 17 }}>Read the following code to the merchant</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 40 }}>
            {getCardCodeRepresentation()}
          </Text>
        </View>
      </PopupModal>
    </DimAnim>
  );
};

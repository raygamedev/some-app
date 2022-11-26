import axios from 'axios';
import {CardMarkModel, Log, UserCardModel} from './apiTypes';
import { Env } from '../Env';

const NahatHost = Env.API_URL;

const jsonRequestHeader = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};
export const apiHealthCheck = async (): Promise<boolean> => {
  try {
    const res = await axios.get(`${NahatHost}/health_check`);
    return res.status === 200;
  } catch (err) {
    console.warn(err);
    console.warn(`Error connecting to Backend server: ${NahatHost}`);
    return false;
  }
};

export const apiLog = async (log_data: Log): Promise<boolean> => {
  try {
    const res = await axios.post(`${NahatHost}/log/client`, log_data, {
      headers: jsonRequestHeader,
    });
    return res.status === 200;
  } catch (err) {
    console.warn(err);
    console.warn(`Error logging to Backend server: ${NahatHost}`);
    return false;
  }
};

export const apiPublishBarcode = async (
  userGuid: string,
  mark: CardMarkModel
): Promise<CardMarkModel[]> => {
  try {
    const res = await axios.post(`${NahatHost}/card/publish_barcode`, mark, {
      headers: jsonRequestHeader,
      params: {
        user_guid: userGuid,
      },
    });
    if (res.data.card) return res.data.card.marks;
    else return [];
  } catch (err) {
    console.warn(err);
    console.warn(`Error publishing Barcode to user ${userGuid}, mark data: ${mark}`);
    return [];
  }
};

export const apiRegisterUser = async (userGuid: string) => {
  try {
    await axios.get(`${NahatHost}/user/register`, {
      headers: jsonRequestHeader,
      params: {
        user_guid: userGuid,
      },
    });
  } catch (err) {
    console.warn(err);
    console.warn(`Error registering user ${userGuid}`);
  }
};

export const apiAuthUser = async (userGuid: string) => {
  try {
    const res = await axios.get(`${NahatHost}/user/auth`, {
      headers: jsonRequestHeader,
      params: { user_guid: userGuid },
    });
    console.log(`GET ${apiAuthUser.name}: ${res.status} - ${JSON.stringify(res.data)}`);
    return res.data.auth;
  } catch (err) {
    console.warn(err);
    console.warn(`Error authentication user - userGuid: ${userGuid}`);
  }
};

export const apiGetUserCard = async (userGuid: string): Promise<UserCardModel | null> => {
  try {
    const res = await axios.get(`${NahatHost}/card/current`, {
      params: { user_guid: userGuid },
    });
    console.log(
      `GET ${apiGetUserCard.name}: ${res.status} - ${JSON.stringify(res.data)}`
    );
    return res.data;
  } catch (err) {
    console.warn(err);
    console.warn(`Error getting User card - userGuid: ${userGuid}`);
    return null;
  }
};

export const apiGenerateCard = async (
  userGuid: string
): Promise<UserCardModel | null> => {
  try {
    console.log(userGuid);
    const res = await axios.get(`${NahatHost}/card/generate_new_card`, {
      params: { user_guid: userGuid },
    });
    console.log('Generated new card');
    return res.data.card;
  } catch (err) {
    console.warn(err);
    console.warn(`Error generating new card - userGuid: ${userGuid}`);
    return null;
  }
};

export const apiRedeemCard = async (userGuid: string): Promise<boolean> => {
  try {
    const res = await axios.get(`${NahatHost}/card/redeem`, {
      params: { user_guid: userGuid },
    });
    console.log(`GET ${apiRedeemCard.name}: ${res.status} - ${JSON.stringify(res.data)}`);
    return res.data.redeem;
  } catch (err) {
    console.warn(err);
    console.warn(`Error redeeming card - userGuid: ${userGuid}}`);
    return false;
  }
};

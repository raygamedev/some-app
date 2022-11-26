import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserGuidKey } from '../../config';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { apiAuthUser, apiRegisterUser } from '../../api';

const getUserGuid = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(UserGuidKey);
  } catch (error) {
    return null;
  }
};

const generateUserGuid = async () => {
  const guid = uuidv4();
  console.log(`Generating new user ${guid}`);
  await AsyncStorage.setItem(UserGuidKey, guid);
  return guid;
};
const handleFirstAppLaunch = async (): Promise<string | null> => {
  try {
    const guid = await generateUserGuid();
    await apiRegisterUser(guid);
    return guid;
  } catch (error) {
    console.log('RayRay', 'error', error);
    return null;
  }
};

export const handleAppLaunch = async (): Promise<string | null> => {
  let userGuid = await getUserGuid();
  if (userGuid === null) {
    userGuid = await handleFirstAppLaunch();
    return userGuid;
  } else {
    try {
      const auth = await apiAuthUser(userGuid);
      if (!auth) await apiRegisterUser(userGuid);
      return userGuid;
    } catch (err) {
      console.log(`Error authenticating user ${err}`);
      const newUserGuid = await generateUserGuid();
      await apiRegisterUser(newUserGuid);
      return newUserGuid;
      // TODO handle error somehow, either by regenerating code
    }
  }
};

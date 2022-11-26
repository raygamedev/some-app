import Constants from 'expo-constants';

export const UserGuidKey = 'user_guid';
const ProductionServer = 'https://nahat-production-7f7bisrofa-lm.a.run.app';
const DevLocalhost = 'http://10.0.0.20:8080';
const DevServer = 'https://nahat-dev-beta-7f7bisrofa-lm.a.run.app';
const getHost = () => {
  if (!Constants.expoConfig?.extra?.env) return DevServer;
  switch (Constants.expoConfig.extra.env) {
    case 'dev':
      return DevLocalhost;
    case 'production':
      return ProductionServer;
    case 'dev_server':
      return DevServer;
    default:
      return DevServer;
  }
};
console.log(`ENV = ${Constants.expoConfig?.extra?.env}`);
export const NahatHost = getHost();
console.log(`Connecting to host: ${NahatHost}`);

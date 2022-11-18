import Constants from "expo-constants";

const ProtocolTypes = {
  HTTP: "http://",
  HTTPS: "https://",
  WS: "ws://",
  WSS: "wss://",
};

export const AppVariants = {
  SomeMobile: "some_mobile",
  SomeClient: "some_client",
};

const ProductionServer = "nahat-dev-beta-7f7bisrofa-lm.a.run.app";
const DevLocalhost = "10.0.0.20:8080";
const DevServer = "nahat-dev-beta-7f7bisrofa-lm.a.run.app";

const getEnv = () => {
  if (!Constants.expoConfig?.extra?.env) return "dev_server";
  return Constants.expoConfig.extra.env;
};

const getAppVariant = () => {
  if (!Constants.expoConfig?.extra?.appVariant) return AppVariants.SomeMobile;
  return Constants.expoConfig.extra.appVariant;
};

const getHost = () => {
  switch (getEnv()) {
    case "dev":
      return DevLocalhost;
    case "production":
      return ProductionServer;
    case "dev_server":
      return DevServer;
    default:
      return ProductionServer;
  }
};

const getProtocol = (isWs = false) => {
  if (isWs) return getEnv() === "dev" ? ProtocolTypes.WS : ProtocolTypes.WSS;
  return getEnv() === "dev" ? ProtocolTypes.HTTP : ProtocolTypes.HTTPS;
};

const getHostUrl = (isWs = false) => getProtocol(isWs) + getHost();

export const Env = {
  API_URL: getHostUrl(),
  WS_URL: getHostUrl(true),
  APP_VARIANT: getAppVariant(),
};

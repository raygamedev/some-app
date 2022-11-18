const APP_VARIANT = process.env.APP_VARIANT;
const ENV = process.env.ENV;

const mobileVariant = {
  name: "Some App",
  slug: "some-app",
  version: process.env.MY_CUSTOM_PROJECT_VERSION || "1.0.0",
  // All values in extra will be passed to your app.

  owner: "raydevs",
  orientation: "portrait",
  icon: "./assets/someAppIcon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  extra: {
    env: ENV,
    appVariant: APP_VARIANT,
    eas: {
      projectId: "bc77cd86-728b-484d-96c7-eec20e4f631c",
    },
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/bc77cd86-728b-484d-96c7-eec20e4f631c",
  },

  runtimeVersion: {
    policy: "sdkVersion",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.raydevs.someapp",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
};

const someClientVariant = {
  name: "Some Client",
  slug: "some-client",
  version: process.env.MY_CUSTOM_PROJECT_VERSION || "1.0.0",
  // All values in extra will be passed to your app.

  owner: "raydevs",
  orientation: "portrait",
  icon: "./assets/someAppIcon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  extra: {
    env: ENV,
    appVariant: APP_VARIANT,
    eas: {
      projectId: "a27fe088-457b-479d-b78e-10b7878307d5",
    },
  },
  updates: {
    url: "https://u.expo.dev/a27fe088-457b-479d-b78e-10b7878307d5",
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },

  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
};
const getAppConfig = () => {
  if (APP_VARIANT === "some_mobile") {
    return mobileVariant;
  } else if (APP_VARIANT === "some_client") {
    return someClientVariant;
  }
  throw new Error("Missing app variant");
};

export default getAppConfig();

export const IS_DEV = process.env.REACT_APP_ENV !== "PROD";
const WS_PORT = process.env.REACT_APP_WS_PORT;
//export const hostName = window.location.hostname;
const hostName = "103.127.7.198";
export const WS_URLS = {
  DEV: `http://${hostName}:${WS_PORT || 5300}`,
  STAGING: "https://ws-test.ludoplayers.com",
  PROD: "https://ws.ludoplayers.com",
};
export const WS_ENDPOINT = WS_URLS[process.env.REACT_APP_ENV || "DEV"];

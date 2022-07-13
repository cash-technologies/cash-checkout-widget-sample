import axios from "axios";
import { API_HEADER_KEYS, METADATA_KEYS } from "./constants/variable";
import { v4 as uuidv4 } from "uuid";
import { createDateOffset } from "./utils";

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common.Accept = "application/json";

export const setAxiosMetadataHeader = (() => {
  const payload: any = null;

  return (key: string, value: any) => {
    payload[key] = value;
    axios.defaults.headers.common[API_HEADER_KEYS.FRAUD_METADATA] = Buffer.from(
      JSON.stringify(payload),
      "utf8"
    ).toString("base64");
  };
})();

export const setMetaData = async () => {
  let batteryData = {};
  try {
    // @ts-ignore: Cannot find name
    const BatteryManager = await window.navigator.getBattery();
    batteryData = {
      [METADATA_KEYS.BATTERY_LEVEL]: BatteryManager.level,
      [METADATA_KEYS.IS_BATTERY_CHARGING]: BatteryManager.charging,
    };
  } catch (e) {
    // TODO: handle error
  }

  const res = await axios.get("https://geolocation-db.com/json/");
  const ipAddress = res?.data?.IPv4;

  const timeZoneData = createDateOffset(new Date());

  const fraudMetadata = {
    // @ts-ignore: Cannot find name
    [METADATA_KEYS.DEVICE_ID]: MediaDeviceInfo.deviceId || uuidv4(),
    [METADATA_KEYS.IP_ADDRESS]: ipAddress,
    [METADATA_KEYS.USER_AGENT]: navigator.userAgent,
    [METADATA_KEYS.IS_CONNECTED_TO_WIFI]: navigator.onLine,
    [METADATA_KEYS.TIME_ZONE]: timeZoneData,
    ...batteryData,
  };

  // eslint-disable-next-line no-unused-vars
  const filterFraudMetadata = Object.fromEntries(
    Object.entries(fraudMetadata).filter(([_, v]) => v !== "")
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(filterFraudMetadata)) {
    setAxiosMetadataHeader(key, value);
  }
};

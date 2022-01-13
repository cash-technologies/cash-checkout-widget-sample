import axios from "axios";
import { API_HEADER_KEYS, METADATA_KEYS } from "./constants/variable";
import base64 from "./utils/base64";
import { v4 as uuidv4 } from 'uuid';

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common.Accept = "application/json";

export const setAxiosMetadataHeader = (() => {
    const payload = {};
    return (key, value) => {
        payload[key] = value;
        axios.defaults.headers.common[API_HEADER_KEYS.FRAUD_METADATA] = base64.encode(JSON.stringify(payload));
    };
})();

export const setMetaData = async () => {
    const BatteryManager = await window.navigator.getBattery();

    const res = await axios.get('https://geolocation-db.com/json/')
    const ipAddress = res?.data?.IPv4;

    const fraudMetadata = {
        [METADATA_KEYS.DEVICE_ID]: MediaDeviceInfo.deviceId || uuidv4(),
        [METADATA_KEYS.IP_ADDRESS]: ipAddress,
        [METADATA_KEYS.USER_AGENT]: navigator.userAgent,
        [METADATA_KEYS.IS_CONNECTED_TO_WIFI]: navigator.onLine,
        [METADATA_KEYS.BATTERY_LEVEL]: BatteryManager.level,
        [METADATA_KEYS.IS_BATTERY_CHARGING]: BatteryManager.charging
    };

    // eslint-disable-next-line no-unused-vars
    const filterFraudMetadata = Object.fromEntries(Object.entries(fraudMetadata).filter(([_, v]) => v !== ""));

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filterFraudMetadata)) {
        setAxiosMetadataHeader(key, value);
    }
};

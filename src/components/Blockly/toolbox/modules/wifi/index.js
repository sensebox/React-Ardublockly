// MCU
export const wifi = { kind: "block", type: "sensebox_wifi" };
export const wifiStatus = { kind: "block", type: "sensebox_wifi_status" };
export const wifiRssi = { kind: "block", type: "sensebox_wifi_rssi" };
export const getIp = { kind: "block", type: "sensebox_get_ip" };
export const startAp = { kind: "block", type: "sensebox_startap" };

// ESP32-S2
export const esp32s2Wifi = { kind: "block", type: "sensebox_esp32s2_wifi" };
export const esp32s2WifiEnterprise = {
  kind: "block",
  type: "sensebox_esp32s2_wifi_enterprise",
};
export const esp32s2WifiStatus = {
  kind: "block",
  type: "sensebox_wifi_status",
};
export const esp32s2WifiRssi = { kind: "block", type: "sensebox_wifi_rssi" };
export const esp32s2StartAp = {
  kind: "block",
  type: "sensebox_esp32s2_startap",
};

export default {
  mcu: [wifi, wifiStatus, wifiRssi, getIp, startAp],
  mini: [wifi, wifiStatus, wifiRssi, getIp, startAp],
  esp32: [
    esp32s2Wifi,
    esp32s2WifiEnterprise,
    esp32s2WifiStatus,
    esp32s2WifiRssi,
    esp32s2StartAp,
  ],
};

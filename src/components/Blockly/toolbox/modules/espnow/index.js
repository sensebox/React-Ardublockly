export const espnow = { kind: "block", type: "sensebox_esp_now" };
export const espnowSender = { kind: "block", type: "sensebox_esp_now_sender" };
export const getMac = { kind: "block", type: "sensebox_get_mac" };
export const espnowReceive = {
  kind: "block",
  type: "sensebox_esp_now_receive",
};
export const espnowSend = { kind: "block", type: "sensebox_esp_now_send" };

export default {
  esp32: [espnow, espnowSender, getMac, espnowReceive, espnowSend],
};

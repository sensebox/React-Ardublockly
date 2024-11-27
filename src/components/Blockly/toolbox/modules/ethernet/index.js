export const ethernet = { kind: "block", type: "sensebox_ethernet" };
export const ethernetIp = { kind: "block", type: "sensebox_ethernetIp" };

export default {
  mcu: [ethernet, ethernetIp],
  mini: [ethernet, ethernetIp],
  esp32: [ethernet, ethernetIp],
};

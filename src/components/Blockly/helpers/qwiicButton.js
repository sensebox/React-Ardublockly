// Public, high-level operations from SparkFun_Qwiic_Button.h.
export const QWIIC_STATUS = [
  "isPressed",
  "hasBeenClicked",
  "available",
  "isConnected",
  "checkDeviceID",
  "isPressedQueueEmpty",
  "isPressedQueueFull",
  "isClickedQueueEmpty",
  "isClickedQueueFull",
];
export const QWIIC_VALUES = [
  "timeSinceLastPress",
  "timeSinceFirstPress",
  "popPressedQueue",
  "timeSinceLastClick",
  "timeSinceFirstClick",
  "popClickedQueue",
  "getDebounceTime",
  "getI2Caddress",
  "getFirmwareVersion",
  "deviceID",
  "getDeviceType",
];
export const QWIIC_BUTTONS = Array.from({ length: 8 }, (_, i) => [
  String(i + 1),
  String(i + 1),
]);
export const QWIIC_SETTINGS = [
  ["ADDRESS", "qwiic_address", 111, 8, 119],
  ["DEBOUNCE", "qwiic_TIME", 20, 0, 65535],
  ["BRIGHTNESS", "qwiic_BRIGHTNESS", 255, 0, 255],
  ["CYCLE", "qwiic_CYCLE", 1000, 0, 65535],
  ["OFF", "qwiic_OFF", 200, 0, 65535],
  ["GRANULARITY", "qwiic_GRANULARITY", 1, 1, 255],
];

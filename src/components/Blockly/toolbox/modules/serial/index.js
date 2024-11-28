export const initSerialMonitor = { kind: "block", type: "init_serial_monitor" };
export const printSerialMonitor = {
  kind: "block",
  type: "print_serial_monitor",
};

export default {
  mcu: [initSerialMonitor, printSerialMonitor],
  mini: [initSerialMonitor, printSerialMonitor],
  esp32: [initSerialMonitor, printSerialMonitor],
};

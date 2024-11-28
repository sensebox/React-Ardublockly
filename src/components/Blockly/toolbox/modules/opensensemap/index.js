export const esp32_sensebox_interval_timer = {
  kind: "block",
  type: "sensebox_interval_timer",
  inputs: {
    DO: {
      block: { kind: "block", type: "sensebox_esp32s2_osem_connection" },
    },
  },
};

export const sensebox_interval_timer = {
  kind: "block",
  type: "sensebox_interval_timer",
  inputs: {
    DO: {
      block: { kind: "block", type: "sensebox_osem_connection" },
    },
  },
};

export const sensebox_send_to_osem = {
  kind: "block",
  type: "sensebox_send_to_osem",
};

export default {
  mcu: [sensebox_interval_timer, sensebox_send_to_osem],
  mini: [sensebox_interval_timer, sensebox_send_to_osem],
  esp32: [esp32_sensebox_interval_timer, sensebox_send_to_osem],
};

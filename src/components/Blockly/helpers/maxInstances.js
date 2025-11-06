/**
 * To limit number of specific blocks in the workspace add block name and number of maxInstances here.
 *
 */

var board = window.sessionStorage.getItem("board");

const maxInstances = {
  sensebox_wifi: 1,
  sensebox_startap: 1,
  sensebox_display_beginDisplay: 1,
  sensebox_telegram: 1,
  sensebox_telegram_do: 1,
  sensebox_osem_connection: 1,
  sensebox_lora_initialize_otaa: 1,
  sensebox_lora_initialize_abp: 1,
  sensebox_phyphox_init: 1,
  sensebox_phyphox_experiment: 1,
  sensebox_phyphox_experiment_send: 1,
  sensebox_ethernet: 1,
};

const maxInstancesEsp = {
  sensebox_wifi: 1,
  sensebox_startap: 1,
  sensebox_display_beginDisplay: 1,
  sensebox_telegram: 1,
  sensebox_telegram_do: 1,
  sensebox_osem_connection: 1,
  sensebox_lora_initialize_otaa: 1,
  sensebox_lora_initialize_abp: 1,
  sensebox_phyphox_init: 1,
  sensebox_phyphox_experiment: 1,
  sensebox_phyphox_experiment_send: 1,
  sensebox_ethernet: 0,
};

export const getMaxInstances = () => {
  if (board === "MCU-S2") {
    return maxInstancesEsp;
  } else if (board === "MCU" || board === "MCU:MINI") {
    return maxInstances;
  }
};

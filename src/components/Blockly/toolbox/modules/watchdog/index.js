export const watchdogEnable = { kind: "block", type: "watchdog_enable" };
export const watchdogReset = { kind: "block", type: "watchdog_reset" };

export default {
  mcu: [watchdogEnable, watchdogReset],
  mini: [watchdogEnable, watchdogReset],
  esp32: [watchdogEnable, watchdogReset],
};

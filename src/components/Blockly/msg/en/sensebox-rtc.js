export const RTC = {
  sensebox_rtc_init: "Initialise external RTC",
  sensebox_rtc_init_tooltip:
    "Initialise the RTC. Connect it to one of the 5 I2C/Wire connections and insert the battery. Before you can read out the time, it must first be set. This step usually only needs to be done once.",
  sensebox_rtc_set: "Set RTC time/date:",
  sensebox_rtc_set_tooltip:
    "Sets the time of the RTC. Note that you execute this block in the setup.",
  sensebox_rtc_get_timestamp: "Timestamp external RTC (RFC 3339)",
  sensebox_rtc_get_timestamp_tooltip:
    "Returns a timestamp formatted in ISO 8601. Ex: 2021-12-24T18:21Z",
  sensebox_rtc_get_tooltip: "Returns the selected value",
  sensebox_rtc_set_ntp: "Set time via NTP-Server",
  sensebox_rtc_get: "Get: ",
  sensebox_rtc_second: "seconds",
  sensebox_rtc_minutes: "minutes",
  sensebox_rtc_hour: "hour",
  sensebox_rtc_day: "day",
  sensebox_rtc_month: "month",
  sensebox_rtc_year: "year",
  sensebox_internal_rtc_init: "Initialise internal RTC",
  sensebox_internal_rtc_init_tooltip:
    "Initialise the internal RTC. This RTC is not battery backed and will be reset on every power cycle.",
  sensebox_internal_rtc_set: "Set internal RTC time/date:",
  sensebox_internal_rtc_set_tooltip:
    "Sets the time of the internal RTC. Note that you execute this block in the setup.",
  sensebox_internal_rtc_get: "Get: ",
  sensebox_internal_rtc_get_timestamp: "Timestamp internal RTC (RFC 3339)",
  sensebox_internal_rtc_get_timestamp_tooltip:
    "Returns a timestamp formatted in ISO 8601. Ex: 2021-12-24T18:21Z",
  sensebox_internal_rtc_get_tooltip: "Returns the selected value",
  sensebox_internal_rtc_epoch: "Unix Time",
  sensebox_internal_rtc_year: "year",
  sensebox_internal_rtc_month: "month",
  sensebox_internal_rtc_day: "day",
  sensebox_internal_rtc_hour: "hour",
  sensebox_internal_rtc_minutes: "minutes",
  sensebox_internal_rtc_seconds: "seconds",
};

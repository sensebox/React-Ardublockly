export const RTC = {
  sensebox_rtc_init: "Initialisiere externe RTC",
  sensebox_rtc_init_tooltip:
    "Initialisiere die RTC. Schließe diese an einen der 5 I2C/Wire Anschlüsse an und lege die Batterie ein. Bevor du die Uhrzeit auslesen kannst muss diese zunächst einmal gesetzt werden. Dieser Schritt muss normalerweise nur einmalig durchgeführt werden.",
  sensebox_rtc_set: "Setze Uhrzeit/Datum der externen RTC",
  sensebox_rtc_set_tooltip:
    "Stellt die Uhrzeit der RTC ein. Beachte, dass du diesen Block im Setup ausführst.",
  sensebox_rtc_get_timestamp: "Zeitstempel externe RTC (RFC 3339)",
  sensebox_rtc_get_timestamp_tooltip:
    "Gibt dir einen in ISO 8601 formatierten Zeitstempel zurück. Bsp: 2021-12-24T18:21Z",
  sensebox_rtc_get: "Wert (externe RTC): ",
  sensebox_rtc_get_tooltip: "Gibt dir den ausgewählten Wert zurück.",
  sensebox_rtc_second: "Sekunden",
  sensebox_rtc_minutes: "Minuten",
  sensebox_rtc_hour: "Stunden",
  sensebox_rtc_day: "Tag",
  sensebox_rtc_month: "Monat",
  sensebox_rtc_year: "Jahr",
  sensebox_internal_rtc_init: "Initialisiere interne RTC",
  sensebox_internal_rtc_init_tooltip:
    "Initialisieren der internen RTC. Diese RTC ist nicht batteriegepuffert und wird bei jedem Einschaltvorgang zurückgesetzt",
  sensebox_internal_rtc_set: "Setze interne RTC Zeit/Datum (Unix Time)",
  sensebox_internal_rtc_set_tooltip:
    "Setzt die Zeit der internen RTC. Führe den Block einmalig im Setup aus und setzte die Uhrzeit über die Unix Zeit.",
  sensebox_internal_rtc_get: "Wert (interne RTC): ",
  sensebox_internal_rtc_get_timestamp: "Zeitstempel interne RTC (RFC 3339)",
  sensebox_internal_rtc_get_timestamp_tooltip:
    "Returns a timestamp formatted in ISO 8601. Ex: 2021-12-24T18:21Z",
  sensebox_internal_rtc_get_tooltip: "Gibt den ausgewählten Wert zurück",
  sensebox_internal_rtc_epoch: "Unix Zeit",
  sensebox_internal_rtc_year: "Jahr",
  sensebox_internal_rtc_month: "Monat",
  sensebox_internal_rtc_day: "Tag",
  sensebox_internal_rtc_hour: "Stunde",
  sensebox_internal_rtc_minutes: "Minute",
  sensebox_internal_rtc_seconds: "Sekunde",
};

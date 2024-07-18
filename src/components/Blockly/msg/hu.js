import { AUDIO } from "./hu/audio";
import { BLE } from "./hu/sensebox-ble";
import { FAQ } from "./hu/faq";
import { IO } from "./hu/io";
import { LOGIC } from "./hu/logic";
import { LOOPS } from "./hu/loops";
import { MATH } from "./hu/math";
import { MQTT } from "./hu/mqtt";
import { SENSEBOX } from "./hu/sensebox";
import { DISPLAY } from "./hu/sensebox-display";
import { MOTORS } from "./hu/sensebox-motors";
import { LED } from "./hu/sensebox-led";
import { LORA } from "./hu/sensebox-lora";
import { OSEM } from "./hu/sensebox-osem";
import { RTC } from "./hu/sensebox-rtc";
import { NTP } from "./hu/sensebox-ntp";
import { SD } from "./hu/sensebox-sd";
import { SENSORS } from "./hu/sensebox-sensors";
import { TELEGRAM } from "./hu/sensebox-telegram";
import { WEB } from "./hu/sensebox-web";
import { TEXT } from "./hu/text";
import { TIME } from "./hu/time";
import { TOURS } from "./hu/tours";
import { TRANSLATIONS } from "./hu/translations";
import { UI } from "./hu/ui";
import { VARIABLES } from "./hu/variables";
import { WEBSERVER } from "./hu/webserver";

export const Hu = {
  ...AUDIO,
  ...BLE,
  ...FAQ,
  ...IO,
  ...LOGIC,
  ...LOOPS,
  ...MATH,
  ...MQTT,
  ...DISPLAY,
  ...MOTORS,
  ...LED,
  ...LORA,
  ...OSEM,
  ...RTC,
  ...NTP,
  ...SD,
  ...SENSORS,
  ...SENSEBOX,
  ...TELEGRAM,
  ...WEB,
  ...TEXT,
  ...TIME,
  ...TOURS,
  ...TRANSLATIONS,
  ...UI,
  ...VARIABLES,
  ...WEBSERVER,
};

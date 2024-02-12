export const IO = {
  ARD_ANALOGREAD: "analóg pin# olvasása",
  ARD_ANALOGREAD_TIP: "0 és 1023 közötti visszatérési érték",
  ARD_ANALOGWRITE: "analóg pin# beállítása",
  ARD_ANALOGWRITE_TIP:
    "Analóg érték írása 0 és 255 között egy adott PWM portra",
  ARD_BUILTIN_LED: "beépített LED beállítása",
  ARD_BUILTIN_LED_TIP: "Az Arduino beépített LED-jének világítása vagy kikapcsolása",
  ARD_COMPONENT_WARN1:
    "A blokk használatához hozzá kell adni egy %1 konfigurációs blokkot ugyanezzel a %2 névvel!",
  ARD_DEFINE: "Definiálja a  címet.",
  ARD_DIGITALREAD: "digitális pin# olvasása",
  ARD_DIGITALREAD_TIP: "Digitális érték olvasása egy pin-en: HIGH vagy LOW",
  ARD_DIGITALWRITE: "digitális pin# beállítása",
  ARD_DIGITALWRITE_TIP: "Digitális érték HIGH vagy LOW írása egy adott portra",
  ARD_FUN_RUN_LOOP: "Arduino loop()",
  ARD_FUN_RUN_SETUP: "Arduino setup()",
  ARD_FUN_RUN_TIP: "Meghatározza az Arduino setup() és loop() függvényeket.",
  ARD_HIGH: "HIGH",
  ARD_HIGHLOW_TIP: "Egy pin állapotának beállítása logikai magas vagy alacsony értékre.",
  ARD_LOW: "LOW",
  ARD_MAP: "Térkép értéke",
  ARD_MAP_FROMMAX: "Max-től",
  ARD_MAP_FROMMIN: "a Min",
  ARD_MAP_TIP: "Egy [0-1024] közötti számot átképez egy másikra.",
  ARD_MAP_TOMAX: "Maxnek",
  ARD_MAP_TOMIN: "a Min",
  ARD_MAP_VAL: "értéket [0-",
  ARD_NOTONE: "Hangjelzés kikapcsolása a # tűn",
  ARD_NOTONE_PIN: "Nincs hangjelzés PIN#",
  ARD_NOTONE_PIN_TIP: "A hangjelzés leállítása egy csapon",
  ARD_NOTONE_TIP: "Kikapcsolja a hangjelzést a kiválasztott csapon",
  ARD_PIN_WARN1: "A %1-es tűt a %2-es tűhöz %3-as tűként kell csatlakoztatni. Már %4-ként használják.",
  ARD_PULSETIMEOUT_TIP:
    "A kiválasztott csapon lévő impulzus időtartamát méri, ha az a mikroszekundumban megadott időkorláton belül van.",
  ARD_PULSE_READ: "mérje %1 impulzust a #%2 tűn",
  ARD_PULSE_READ_TIMEOUT: "%1 impulzus mérése a #%2 tűn (időkorlát %3 μs után)",
  ARD_PULSE_TIP: "A kiválasztott csapon lévő impulzus időtartamát méri.",
  ARD_SERIAL_BPS: "bps",
  ARD_SERIAL_PRINT: "print",
  ARD_SERIAL_PRINT_NEWLINE: "új sor hozzáadása",
  ARD_SERIAL_PRINT_TIP:
    "Az adatokat a konzolra/soros portra nyomtatja ki ember által olvasható ASCII szövegként.",
  ARD_SERIAL_PRINT_WARN:
    "A blokk használatához a %1 beállítási blokkot hozzá kell adni a munkaterülethez!",
  ARD_SERIAL_SETUP: "Beállítás",
  ARD_SERIAL_SETUP_TIP: "Egy adott soros periféria sebességének kiválasztása",
  ARD_SERIAL_SPEED: ": sebesség",
  ARD_SERVO_READ: "SERVO olvasása a PIN#-ból",
  ARD_SERVO_READ_TIP: "Servo szög olvasása",
  ARD_SERVO_WRITE: "SERVO beállítása a PIN-kódról",
  ARD_SERVO_WRITE_DEG_180: "fok (0~180)",
  ARD_SERVO_WRITE_TIP: "Szervó beállítása egy megadott szögre",
  ARD_SERVO_WRITE_TO: "a  címre.",
  ARD_SETTONE: "Hangjelzés beállítása a # tűn",
  ARD_SPI_SETUP: "Beállítás",
  ARD_SPI_SETUP_CONF: "konfiguráció:",
  ARD_SPI_SETUP_DIVIDE: "óraosztás",
  ARD_SPI_SETUP_LSBFIRST: "LSBFIRST",
  ARD_SPI_SETUP_MODE: "SPI üzemmód (üresjárat - él)",
  ARD_SPI_SETUP_MODE0: "0 (Low - Falling)",
  ARD_SPI_SETUP_MODE1: "1 (Low - Rising)",
  ARD_SPI_SETUP_MODE2: "2 (High - Falling)",
  ARD_SPI_SETUP_MODE3: "3 (High - Rising)",
  ARD_SPI_SETUP_MSBFIRST: "MSBFIRST",
  ARD_SPI_SETUP_SHIFT: "adateltolódás",
  ARD_SPI_SETUP_TIP: "Az SPI periféria konfigurálása.",
  ARD_SPI_TRANSRETURN_TIP:
    "SPI-üzenet küldése egy megadott slave eszköznek és adatok visszakapása.",
  ARD_SPI_TRANS_NONE: "nincs",
  ARD_SPI_TRANS_SLAVE: "a slave pin-re",
  ARD_SPI_TRANS_TIP: "SPI-üzenet küldése egy megadott szolgaeszköznek.",
  ARD_SPI_TRANS_VAL: "átutalás",
  ARD_SPI_TRANS_WARN1:
    "A blokk használatához a %1 beállítási blokkot hozzá kell adni a munkaterülethez!",
  ARD_SPI_TRANS_WARN2: "A régi pin érték %1 már nem elérhető.",
  ARD_STEPPER_COMPONENT: "stepper",
  ARD_STEPPER_DEFAULT_NAME: "MyStepper",
  ARD_STEPPER_FOUR_PINS: "4",
  ARD_STEPPER_MOTOR: "léptetőmotor:",
  ARD_STEPPER_NUMBER_OF_PINS: "Tüskék száma",
  ARD_STEPPER_PIN1: "pin1#",
  ARD_STEPPER_PIN2: "pin2#",
  ARD_STEPPER_PIN3: "pin3#",
  ARD_STEPPER_PIN4: "pin4#",
  ARD_STEPPER_REVOLVS: "hány lépés/fordulat",
  ARD_STEPPER_SETUP: "Lépéses motor beállítása",
  ARD_STEPPER_SETUP_TIP:
    "A léptetőmotor pinoutjának és egyéb beállításainak konfigurálása.",
  ARD_STEPPER_SPEED: "sebesség (fordulatszám) beállítása",
  ARD_STEPPER_STEP: "move stepper",
  ARD_STEPPER_STEPS: "lépések",
  ARD_STEPPER_STEP_TIP: "A léptetőmotort meghatározott számú lépéssel forgatja.",
  ARD_STEPPER_TWO_PINS: "2",
  ARD_TYPE_ARRAY: "Array",
  ARD_TYPE_BOOL: "Boolean",
  ARD_TYPE_CHAR: "Character",
  ARD_TYPE_CHILDBLOCKMISSING: "ChildBlockMissing",
  ARD_TYPE_DECIMAL: "Decimal",
  ARD_TYPE_LONG: "Large Number",
  ARD_TYPE_NULL: "Null",
  ARD_TYPE_NUMBER: "Number",
  ARD_TYPE_SHORT: "Short Number",
  ARD_TYPE_TEXT: "Text",
  ARD_TYPE_UNDEF: "Undefined",
  ARD_VAR_AS: "as",
  ARD_VAR_AS_TIP: "Sets a value to a specific type",
  ARD_WRITE_TO: "to",
  NEW_INSTANCE: "New instance...",
  NEW_INSTANCE_TITLE: "New instance name:",
  RENAME_INSTANCE: "Rename instance...",
  RENAME_INSTANCE_TITLE: "Rename all '%1' instances to:",
};
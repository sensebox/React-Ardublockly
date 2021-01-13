
export const IO = {

    ARD_ANALOGREAD: "lese analogen Pin#",
    ARD_ANALOGREAD_TIP: "Gibt einen Wert zwischen 0 und 1024 zurüch",
    ARD_ANALOGWRITE: "setzte analogen Pin#",
    ARD_ANALOGWRITE_TIP: "Schreibe analogen Wert zwischen 0 und 255 an einen spezifischen PWM Port",
    ARD_BUILTIN_LED: "eingebaute LED",
    ARD_BUILTIN_LED_TIP: "Schaltet die interne LED An oder Aus",
    ARD_COMPONENT_WARN1: "A %1 configuration block with the same %2 name must be added to use this block!",
    ARD_DEFINE: "Definiere",
    ARD_DIGITALREAD: "lesen digitalen Pin#",
    ARD_DIGITALREAD_TIP: "Lese Wert an digitalen Pin: HIGH(1) oder LOW(0)",
    ARD_DIGITALWRITE: "setzte digitalen Pin#",
    ARD_DIGITALWRITE_TIP: "Schreibe digitalen Wert HIGH (1) oder LOW(0) an spezifischen Port",
    ARD_FUN_RUN_LOOP: "Endlosschleife()",
    ARD_FUN_RUN_SETUP: "Setup()",
    ARD_FUN_RUN_TIP: "Definiert die setup() und loop() Funktionen. Die setup()-Funktion wird beim starten **einmal** ausgeführt. Anschließend wir die loop()-Funktion in einer **Endlosschleife** ausgeführt. Füge in die Setup()-Funktion Blöcke ein, um z.B. das Display zu initalisieren, eine Verbindung zum WiFi-Netzwerk herzustellen oder um die LoRa Verbindung zu initialsieren.",
    ARD_HIGH: "HIGH",
    ARD_HIGHLOW_TIP: "Setzt einen Status auf HIGH oder LOWSet a pin state logic High or Low.",
    ARD_LOW: "LOW",
    ARD_MAP: "Verteile Wert",
    ARD_MAP_FROMMIN: "von Minimum",
    ARD_MAP_FROMMAX: "bis maximum",
    ARD_MAP_TOMIN: "auf Minimum",
    ARD_MAP_TOMAX: "bis Maximum",
    ARD_MAP_TIP: "Verteilt Werte zwischen [0-1024] zu andere.",
    ARD_MAP_VAL: "Wert zu [0-",
    ARD_NOTONE: "Schalte Ton aus an Pin",
    ARD_NOTONE_PIN: "keinen Ton an Pin",
    ARD_NOTONE_PIN_TIP: "Stoppe die Tonerzeugung an Pin",
    ARD_NOTONE_TIP: "Schaltet den Ton am ausgewählten Pin aus",
    ARD_PIN_WARN1: "Pin %1 wird benötigt für  %2 als Pin %3. Bereitsgenutzt als %4.",
    ARD_PULSETIMEOUT_TIP: "Misst die Laufzeit eines Impulses am ausgewählten Pin, wenn die Zeit ist in Microsekunden.",
    ARD_PULSE_READ: "Misst %1 Impuls an Pin #%2",
    ARD_PULSE_READ_TIMEOUT: "Misst %1 Impuls an Pin #%2 (Unterbrechung nach %3 μs)",
    ARD_PULSE_TIP: "Misst die Zeit eines Impulses an dem ausgewählten Pin.",
    ARD_SERIAL_BPS: "bps",
    ARD_SERIAL_PRINT: "schreibe",
    ARD_SERIAL_PRINT_NEWLINE: "neue Zeile hinzufügen",
    ARD_SERIAL_PRINT_TIP: "Prints data to the console/serial port as human-readable ASCII text.",  // untranslated
    ARD_SERIAL_PRINT_WARN: "A setup block for %1 must be added to the workspace to use this block!",  // untranslated
    ARD_SERIAL_SETUP: "Setup",
    ARD_SERIAL_SETUP_TIP: "Selects the speed for a specific Serial peripheral",  // untranslated
    ARD_SERIAL_SPEED: ":  Übertragungsgeschwindigkeit zu",
    ARD_SERVO_READ: "liest SERVO an PIN#",
    ARD_SERVO_READ_TIP: "Liest den Winkel des Servomotors aus",
    ARD_SERVO_WRITE: "setzt SERVO an Pin",
    ARD_SERVO_WRITE_DEG_180: "Winkel (0~180)",
    ARD_SERVO_WRITE_TIP: "Set a Servo to an specified angle",  // untranslated
    ARD_SERVO_WRITE_TO: "",  // untranslated
    ARD_SETTONE: "Spiele Ton an Pin",  // untranslated
    ARD_SPI_SETUP: "Setup",
    ARD_SPI_SETUP_CONF: "Konfiguration:",
    ARD_SPI_SETUP_DIVIDE: "clock divide",  // untranslated
    ARD_SPI_SETUP_LSBFIRST: "LSBFIRST",  // untranslated
    ARD_SPI_SETUP_MODE: "SPI mode (idle - edge)",  // untranslated
    ARD_SPI_SETUP_MODE0: "0 (LOW - Fallend)",
    ARD_SPI_SETUP_MODE1: "1 (LOW - Steigend)",
    ARD_SPI_SETUP_MODE2: "2 (HIGH - Fallend)",
    ARD_SPI_SETUP_MODE3: "3 (HIGH - Steigend)",
    ARD_SPI_SETUP_MSBFIRST: "MSBFIRST",  // untranslated
    ARD_SPI_SETUP_SHIFT: "data shift",  // untranslated
    ARD_SPI_SETUP_TIP: "Configures the SPI peripheral.",  // untranslated
    ARD_SPI_TRANSRETURN_TIP: "Send a SPI message to an specified slave device and get data back.",  // untranslated
    ARD_SPI_TRANS_NONE: "none",  // untranslated
    ARD_SPI_TRANS_SLAVE: "to slave pin",  // untranslated
    ARD_SPI_TRANS_TIP: "Send a SPI message to an specified slave device.",  // untranslated
    ARD_SPI_TRANS_VAL: "transfer",  // untranslated
    ARD_SPI_TRANS_WARN1: "A setup block for %1 must be added to the workspace to use this block!",  // untranslated
    ARD_SPI_TRANS_WARN2: "Old pin value %1 is no longer available.",  // untranslated
    ARD_STEPPER_COMPONENT: "stepper",  // untranslated
    ARD_STEPPER_DEFAULT_NAME: "MyStepper",  // untranslated
    ARD_STEPPER_FOUR_PINS: "4",  // untranslated
    ARD_STEPPER_MOTOR: "stepper motor:",  // untranslated
    ARD_STEPPER_NUMBER_OF_PINS: "Number of pins",  // untranslated
    ARD_STEPPER_PIN1: "pin1#",  // untranslated
    ARD_STEPPER_PIN2: "pin2#",  // untranslated
    ARD_STEPPER_PIN3: "pin3#",  // untranslated
    ARD_STEPPER_PIN4: "pin4#",  // untranslated
    ARD_STEPPER_REVOLVS: "how many steps per revolution",  // untranslated
    ARD_STEPPER_SETUP: "Setup stepper motor",  // untranslated
    ARD_STEPPER_SETUP_TIP: "Configures a stepper motor pinout and other settings.",  // untranslated
    ARD_STEPPER_SPEED: "set speed (rpm) to",  // untranslated
    ARD_STEPPER_STEP: "move stepper",  // untranslated
    ARD_STEPPER_STEPS: "steps",  // untranslated
    ARD_STEPPER_STEP_TIP: "Turns the stepper motor a specific number of steps.",  // untranslated
    ARD_STEPPER_TWO_PINS: "2",  // untranslated
    ARD_TYPE_ARRAY: "Array",
    ARD_TYPE_BOOL: "Boolean",
    ARD_TYPE_CHAR: "Zeichen",
    ARD_TYPE_CHILDBLOCKMISSING: "ChildBlockMissing",  // untranslated
    ARD_TYPE_DECIMAL: "Dezimalzahl",
    ARD_TYPE_LONG: "große Zahl",
    ARD_TYPE_NULL: "Null",
    ARD_TYPE_NUMBER: "Zahl",
    ARD_TYPE_SHORT: "kurze Zahl",
    ARD_TYPE_TEXT: "Text",
    ARD_TYPE_UNDEF: "Undefiniert",
    ARD_VAR_AS: "als",
    ARD_VAR_AS_TIP: "Wert einem spezififischen Datentyp zuordnen",
    ARD_WRITE_TO: "zu",
    NEW_INSTANCE: "Neue Instanz...",
    NEW_INSTANCE_TITLE: "Neue Instanz mit Name:",
    RENAME_INSTANCE: "Instanz umbenennen...",
    RENAME_INSTANCE_TITLE: "Benenne alle '%1' Instanzen zu:",

}
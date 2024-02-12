export const MOTORS = {

    /**
     * Motors
     */

    sensebox_motors_beginServoMotor: "Initialize Servo Motor",
    sensebox_motors_beginServoMotor_pin: "Pin:",
    sensebox_motors_beginServoMotor_tooltip: "Csatlakoztassa az egyik digitális csapot a szervomotor narancssárga vezetékéhez. Csatlakoztassa továbbá a GND-t a GND-hez (fekete és barna vezeték) és az 5V-ot az 5V-hoz (piros vezeték).",
    sensebox_motors_beginServoMotor_helpurl: "https://en.wikipedia.org/wiki/Servomotor",

    sensebox_motors_moveServoMotor: "Move Servo Motor",
    sensebox_motors_moveServoMotor_pin: "Pin:",
    sensebox_motors_moveServoMotor_degrees: "Degrees:",
    sensebox_motors_moveServoMotor_tooltip: "A szervomotor 0 és 180 fok közötti meghatározott szögben mozgatható.",
    sensebox_motors_moveServoMotor_helpurl: "https://en.wikipedia.org/wiki/Servomotor",

    sensebox_motors_I2CMotorBoard_begin: "I2C Motor Board inicializálása",
    sensebox_motors_I2CMotorBoard_begin_tooltip: "Csatlakoztassa az I2C Moztor Boardot a két DC motorral az öt I2C-port egyikéhez. Használja ezt a blokkot a setup()-függvényen belül.",
    sensebox_motors_I2CMotorBoard_begin_helpurl: "TODO",

    sensebox_motors_I2CMotorBoard_moveDCMotor: "Move",
    sensebox_motors_I2CMotorBoard_moveDCMotor_left: "left",
    sensebox_motors_I2CMotorBoard_moveDCMotor_right: "right",
    sensebox_motors_I2CMotorBoard_moveDCMotor_motor: "DC Motor at I2C Motor Board",
    sensebox_motors_I2CMotorBoard_moveDCMotor_speed: "Speed:",
    sensebox_motors_I2CMotorBoard_moveDCMotor_tooltip: "A sebességet -100 és 100 között állíthatja be.",
    sensebox_motors_I2CMotorBoard_moveDCMotor_helpurl: "TODO",

    sensebox_motors_I2CMotorBoard_stopDCMotor: "Stop ",
    sensebox_motors_I2CMotorBoard_stopDCMotor_left: "left",
    sensebox_motors_I2CMotorBoard_stopDCMotor_right: "right",
    sensebox_motors_I2CMotorBoard_stopDCMotor_motor: "DC Motor at I2C Motor Board",
    sensebox_motors_I2CMotorBoard_stopDCMotor_tooltip: "TODO",
    sensebox_motors_I2CMotorBoard_stopDCMotor_helpurl: "TODO",

    sensebox_motors_beginStepperMotor: "Initialize Stepper Motor (28BYJ-48)",
    sensebox_motors_beginStepperMotor_rpm: "Forgások percenként:",
    sensebox_motors_beginStepperMotor_pins: "Input Pins (IN1-IN4):",
    sensebox_motors_beginStepperMotor_tooltip: "Csatlakoztassa a digitális csapok közül négyet a megfelelő sorrendben a léptetőmotor lap IN1-IN4 bemeneteihez. Csatlakoztasson egy GND-tűt (fekete vezeték) a mínuszos tűhöz és egy 5V-os tűt (piros vezeték) a pluszos tűhöz a lapon. Csatlakoztassa a léptetőmotort is ehhez a táblához. Használja ezt a blokkot a setup()-funkción belül.",
    sensebox_motors_beginStepperMotor_helpurl: "TODO",

    sensebox_motors_moveStepperMotor: "Move Stepper Motor (28BYJ-48)",
    sensebox_motors_moveStepperMotor_step: "Steps:",
    sensebox_motors_moveStepperMotor_tooltip: "Move stepper motor. 2048 lépés egyenlő egy teljes fordulat.",
    sensebox_motors_moveStepperMotor_helpurl: "TODO",
};


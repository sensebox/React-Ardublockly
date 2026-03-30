export const MOTORS = {
  /**
   * Motors
   */

  sensebox_motors_beginServoMotor: "Initialisiere Servomotor",
  sensebox_motors_beginServoMotor_pin: "Pin:",
  sensebox_motors_beginServoMotor_tooltip:
    "Verbinde einen digitalen Pin mit dem orangen Kabel des Servomotrors. Verbinde zusätzlich GND mit GND (schwarzes und braunes Kabel) und 5V mit 5V (rotes Kabel).",
  sensebox_motors_beginServoMotor_helpurl:
    "https://de.wikipedia.org/wiki/Servomotor",

  sensebox_motors_moveServoMotor: "Bewege Servomotor",
  sensebox_motors_moveServoMotor_pin: "Pin:",
  sensebox_motors_moveServoMotor_degrees: "Winkel in Grad:",
  sensebox_motors_moveServoMotor_tooltip:
    "Der Servomotor kann zwischen 0 und 180 Grad bewegt werden.",
  sensebox_motors_moveServoMotor_helpurl:
    "https://de.wikipedia.org/wiki/Servomotor",

  sensebox_motors_I2CMotorBoard_begin: "Initialize I2C Motor Board",
  sensebox_motors_I2CMotorBoard_begin_tooltip:
    "Connect the I2C Moztor Board with the two DC Motors to one of the I2C-Ports. Use this Block inside the setup()-function.",
  sensebox_motors_I2CMotorBoard_begin_helpurl: "TODO",

  sensebox_motors_I2CMotorBoard_moveDCMotor: "Move",
  sensebox_motors_I2CMotorBoard_moveDCMotor_left: "left",
  sensebox_motors_I2CMotorBoard_moveDCMotor_right: "right",
  sensebox_motors_I2CMotorBoard_moveDCMotor_motor:
    "DC Motor at I2C Motor Board",
  sensebox_motors_I2CMotorBoard_moveDCMotor_speed: "Speed:",
  sensebox_motors_I2CMotorBoard_moveDCMotor_tooltip:
    "You can set the Speed between -100 and 100.",
  sensebox_motors_I2CMotorBoard_moveDCMotor_helpurl: "TODO",

  sensebox_motors_I2CMotorBoard_stopDCMotor: "Stop ",
  sensebox_motors_I2CMotorBoard_stopDCMotor_left: "left",
  sensebox_motors_I2CMotorBoard_stopDCMotor_right: "right",
  sensebox_motors_I2CMotorBoard_stopDCMotor_motor:
    "DC Motor at I2C Motor Board",
  sensebox_motors_I2CMotorBoard_stopDCMotor_tooltip: "TODO",
  sensebox_motors_I2CMotorBoard_stopDCMotor_helpurl: "TODO",

  sensebox_motors_beginStepperMotor: "Initialize Stepper Motor (28BYJ-48)",
  sensebox_motors_beginStepperMotor_rpm: "Rotations per Minute:",
  sensebox_motors_beginStepperMotor_pins: "Input Pins (IN1-IN4):",
  sensebox_motors_beginStepperMotor_tooltip:
    "Connect four of the the digital pins in the right order to the inputs IN1-IN4 on the stepper motor board. Connect a GND pin (black wire) to the minus pin and a 5V pin (red wire) to the plus pin on the board. Also connect the stepper motor to this Board. Use this Block inside the setup()-function.",
  sensebox_motors_beginStepperMotor_helpurl: "TODO",

  sensebox_motors_moveStepperMotor: "Move Stepper Motor (28BYJ-48)",
  sensebox_motors_moveStepperMotor_step: "Steps:",
  sensebox_motors_moveStepperMotor_tooltip:
    "Move stepper motor. 2048 steps equal a full rotation.",
  sensebox_motors_moveStepperMotor_helpurl: "TODO",

  //  ESP DC Pumpen
  sensebox_motors_esp_init: "Initialisiere ESP Pumpe",
  sensebox_motors_esp_port: "Pin:",
  sensebox_motors_esp_duty: "Duty (%):",
  sensebox_motors_esp_init_tooltip:
    "Initialisiere die DC-Pumpe am ESP Board. Wähle Pin M1 oder M2 und setze den Duty (0-100%).",
  sensebox_motors_esp_init_helpurl: "TODO",

  sensebox_motors_esp_forward: "Pumpe vorwärts",
  sensebox_motors_esp_forward_tooltip:
    "Lass die Pumpe vorwärts laufen. Wähle Port M1 oder M2 und setze den Duty (0-100%).",
  sensebox_motors_esp_forward_helpurl: "TODO",

  sensebox_motors_esp_backward: "Pumpe rückwärts",
  sensebox_motors_esp_backward_tooltip:
    "Lass die Pumpe rückwärts laufen. Wähle Port M1 oder M2 und setze den Duty (0-100%).",
  sensebox_motors_esp_backward_helpurl: "TODO",

  sensebox_motors_esp_stop: "Stoppe Pumpe",
  sensebox_motors_esp_stop_tooltip:
    "Stoppe die DC-Pumpe. Wähle Port M1 oder M2.",
  sensebox_motors_esp_stop_helpurl: "TODO",
};

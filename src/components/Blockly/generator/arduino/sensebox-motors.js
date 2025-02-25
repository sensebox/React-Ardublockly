import * as Blockly from "blockly/core";

/**
 * Servo Motor
 *
 */
Blockly.Generator.Arduino.forBlock["sensebox_motors_beginServoMotor"] =
  function () {
    var pin = this.getFieldValue("pin");
    Blockly.Generator.Arduino.libraries_["include_servo_motor"] =
      "#include <Servo.h>";
    Blockly.Generator.Arduino.definitions_[`define_servo_motor_${pin}`] =
      `Servo servo_motor_${pin}; // servo Motor`;
    Blockly.Generator.Arduino.setupCode_[`setup_servo_motor_${pin}`] =
      `servo_motor_${pin}.attach(${pin}); // attach servo motor to pin ${pin}`;
    var code = "";
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_motors_moveServoMotor"] =
  function () {
    var pin = this.getFieldValue("pin");
    var degrees =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "degrees",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "90";
    var code = `servo_motor_${pin}.write(${degrees});  // move servo motor to ${degrees} degrees\n`;
    return code;
  };

/**
 * I2C Motor Board
 *
 */
Blockly.Generator.Arduino.forBlock["sensebox_motors_I2CMotorBoard_begin"] =
  function () {
    Blockly.Generator.Arduino.libraries_["include_i2c_motor_board"] =
      "#include <Grove_I2C_Motor_Driver.h>";
    Blockly.Generator.Arduino.definitions_["define_i2c_motor_board"] = `
#define I2C_MOTOR_BOARD_ADDRESS 0x0f // default I2C address of I2C Motor Board`;
    Blockly.Generator.Arduino.setupCode_["setup_i2c_motor_board"] = `
    Motor.begin(I2C_MOTOR_BOARD_ADDRESS); // Initialize I2C Motor Board`;
    var code = "";
    return code;
  };

Blockly.Generator.Arduino.sensebox_motors_I2CMotorBoard_moveDCMotor =
  function () {
    var motor = this.getFieldValue("motor");
    var speed =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "speed",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "50";
    var code = `Motor.speed(MOTOR${motor}, ${speed}); // set speed of motor\n`;
    return code;
  };

Blockly.Generator.Arduino.sensebox_motors_I2CMotorBoard_stopDCMotor =
  function () {
    var motor = this.getFieldValue("motor");
    var code = `Motor.stop(MOTOR${motor}); // stop motor\n`;
    return code;
  };

/**
 * Stepper Motor
 */
Blockly.Generator.Arduino.forBlock["sensebox_motors_beginStepperMotor"] =
  function () {
    var in1 = this.getFieldValue("in1");
    var in2 = this.getFieldValue("in2");
    var in3 = this.getFieldValue("in3");
    var in4 = this.getFieldValue("in4");
    var rpm = this.getFieldValue("rpm");
    Blockly.Generator.Arduino.libraries_["include_stepper_motor"] =
      "#include <Stepper.h>";
    Blockly.Generator.Arduino.definitions_["define_stepper_motor"] = `
Stepper stepper_motor(2048, ${in1}, ${in2}, ${in3}, ${in4}); // stepper Motor with 2048 steps per rotation`;
    Blockly.Generator.Arduino.setupCode_["setup_stepper_motor"] =
      `stepper_motor.setSpeed(${rpm}); // speed in rotations per minute`;
    var code = "";
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_motors_moveStepperMotor"] =
  function () {
    var steps =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "steps",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "2048";
    var code = `stepper_motor.step(${steps});  // 2048 steps correspond to one rotation\n`;
    return code;
  };

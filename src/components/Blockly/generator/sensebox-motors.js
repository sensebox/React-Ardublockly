import * as Blockly from "blockly/core";


/**
 * Servo Motor
 * 
 */
Blockly.Arduino.sensebox_motors_beginServoMotor = function () {
    var pin = this.getFieldValue("pin");
    Blockly.Arduino.libraries_["include_servo_motor"] = "#include <Servo.h>";
    Blockly.Arduino.definitions_[`define_servo_motor_${pin}`] = `Servo servo_motor_${pin}; // servo Motor`;
    Blockly.Arduino.setupCode_[`setup_servo_motor_${pin}`] = `servo_motor_${pin}.attach(${pin}); // attach servo motor to pin ${pin}`;
    var code = "";
    return code;
};

Blockly.Arduino.sensebox_motors_moveServoMotor = function () {
    var pin = this.getFieldValue("pin");
    var degrees = Blockly.Arduino.valueToCode(this, 'degrees', Blockly.Arduino.ORDER_ATOMIC) || "90";
    var code = `servo_motor_${pin}.write(${degrees});  // move servo motor to ${degrees} degrees\n`;
    return code;
};

/**
 * I2C Motor Board
 * 
 */
Blockly.Arduino.sensebox_motors_I2CMotorBoard_begin = function () {
    Blockly.Arduino.libraries_["include_i2c_motor_board"] = "#include <Grove_I2C_Motor_Driver.h>";
    Blockly.Arduino.definitions_["define_i2c_motor_board"] = `
#define I2C_MOTOR_BOARD_ADDRESS 0x0f // default I2C address of I2C Motor Board`;
    Blockly.Arduino.setupCode_["setup_i2c_motor_board"] = `
    Motor.begin(I2C_MOTOR_BOARD_ADDRESS); // Initialize I2C Motor Board`;
    var code = "";
    return code;
};

Blockly.Arduino.sensebox_motors_I2CMotorBoard_moveDCMotor = function () {
    var motor = this.getFieldValue("motor");
    var speed = Blockly.Arduino.valueToCode(this, 'speed', Blockly.Arduino.ORDER_ATOMIC) || "50";
    var code = `Motor.speed(MOTOR${motor}, ${speed}); // set speed of motor\n`;
    return code;
};

Blockly.Arduino.sensebox_motors_I2CMotorBoard_stopDCMotor = function () {
    var motor = this.getFieldValue("motor");
    var code = `Motor.stop(MOTOR${motor}); // stop motor\n`;
    return code;
};


/**
 * Stepper Motor
 */
Blockly.Arduino.sensebox_motors_beginStepperMotor = function () {
    var in1 = this.getFieldValue("in1");
    var in2 = this.getFieldValue("in2");
    var in3 = this.getFieldValue("in3");
    var in4 = this.getFieldValue("in4");
    var rpm = this.getFieldValue("rpm");
    Blockly.Arduino.libraries_["include_stepper_motor"] = "#include <Stepper.h>";
    Blockly.Arduino.definitions_["define_stepper_motor"] = `
Stepper stepper_motor(2048, ${in1}, ${in2}, ${in3}, ${in4}); // stepper Motor with 2048 steps per rotation`;
    Blockly.Arduino.setupCode_["setup_stepper_motor"] =
        `stepper_motor.setSpeed(${rpm}); // speed in rotations per minute`;
    var code = "";
    return code;
};

Blockly.Arduino.sensebox_motors_moveStepperMotor = function () {
    var steps = Blockly.Arduino.valueToCode(this, 'steps', Blockly.Arduino.ORDER_ATOMIC) || '2048';
    var code = `stepper_motor.step(${steps});  // 2048 steps correspond to one rotation\n`;
    return code;
};
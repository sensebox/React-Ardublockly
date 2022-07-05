import * as Blockly from "blockly/core";

/*Stepper Motor Blocks*/
Blockly.Arduino.sensebox_motors_beginStepperMotor = function () {
    var in1 = this.getFieldValue("in1");
    var in2 = this.getFieldValue("in2");
    var in3 = this.getFieldValue("in3");
    var in4 = this.getFieldValue("in4");
    var rpm = this.getFieldValue("rpm");
    Blockly.Arduino.libraries_["stepper_motor"] = "#include <Stepper.h>";
    Blockly.Arduino.definitions_["define_stepper_motor"] = `
#define SPU 2048 // steps per minute
Stepper stepper_motor(SPU, ${in1}, ${in2}, ${in3}, ${in4}); // stepper Motor`;
    Blockly.Arduino.setupCode_["sensebox_stepper_motor_begin"] =
        `Motor.setSpeed(${rpm}); // speed in rotations per minute`;
    var code = "";
    return code;
};

Blockly.Arduino.sensebox_motors_moveStepperMotor = function () {
    var steps = this.getFieldValue("steps");
    var code = "stepper_motor.step(2048);  // 2048 steps correspond to one rotation";
    return code;
};
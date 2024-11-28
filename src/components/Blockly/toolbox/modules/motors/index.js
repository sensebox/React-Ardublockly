export const senseboxMotorsBeginServoMotor = {
  kind: "block",
  type: "sensebox_motors_beginServoMotor",
};
export const senseboxMotorsMoveServoMotor = {
  kind: "block",
  type: "sensebox_motors_moveServoMotor",
  inputs: {
    degrees: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "90",
        },
      },
    },
  },
};

export default {
  mcu: [senseboxMotorsBeginServoMotor, senseboxMotorsMoveServoMotor],
  mini: [senseboxMotorsBeginServoMotor, senseboxMotorsMoveServoMotor],
  esp32: [senseboxMotorsBeginServoMotor, senseboxMotorsMoveServoMotor],
};

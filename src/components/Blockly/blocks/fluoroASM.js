import * as Blockly from "blockly";
import { getColour } from "@/components/Blockly/helpers/colour";
import store from "@/store";
import {
  setFilterEnabled,
  setDiamondEnabled,
  setFilterOffset,
  setFilterColour,
} from "@/actions/fluoroActions";
import {
  FILTER_OFFSETS,
  FILTER_COLOURS,
} from "@/components/Simulator/nodes/fluoroASM/filter";
import { SIMULATOR_BOARD } from "@/components/Simulator/constants";

Blockly.Blocks["sensebox_fluoroASM_init"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_fluoroASM_init);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_fluoro_tooltip);

    // Filter and diamond only affect the fluoro bee in the simulator, which
    // exists for the MCU-S2 only. The Arduino code is the same for all
    // settings.
    if (store.getState().board.board === SIMULATOR_BOARD) {
      this.appendSimulatorSettings_();
    }
  },

  appendSimulatorSettings_: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_fluoroASM_filter_active)
      .appendField(
        new Blockly.FieldCheckbox("FALSE", (value) => {
          store.dispatch(setFilterEnabled(value === "TRUE"));
        }),
        "FILTER_ACTIVE",
      );

    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_fluoroASM_filter_position)
      .appendField(
        new Blockly.FieldDropdown(
          [
            ["LED 1", "LED1"],
            ["LED 2", "LED2"],
            ["LED 3", "LED3"],
            ["LED 4", "LED4"],
          ],
          (value) => {
            store.dispatch(setFilterOffset(FILTER_OFFSETS[value]));
          },
        ),
        "FILTER_TARGET",
      );

    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_fluoroASM_diamond_active)
      .appendField(
        new Blockly.FieldCheckbox("FALSE", (value) => {
          store.dispatch(setDiamondEnabled(value === "TRUE"));
        }),
        "DIAMOND_ACTIVE",
      );

    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_fluoroASM_filter_colour)
      .appendField(
        new Blockly.FieldDropdown(
          [
            [Blockly.Msg.senseBox_fluoroASM_colour_red, "RED"],
            [Blockly.Msg.senseBox_fluoroASM_colour_green, "GREEN"],
            [Blockly.Msg.senseBox_fluoroASM_colour_blue, "BLUE"],
          ],
          (value) => {
            store.dispatch(setFilterColour(FILTER_COLOURS[value]));
          },
        ),
        "FILTER_COLOR",
      );
  },
};

Blockly.Blocks["sensebox_fluoroASM_setLED"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.fluoro_led)
      .appendField(Blockly.Msg.fluoro_number)
      .appendField(
        new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
        ]),
        "LED_NUMBER",
      );
    this.appendValueInput("BRIGHTNESS", "brightness").appendField(
      Blockly.Msg.senseBox_ws2818_rgb_led_brightness,
    );
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_basic_state)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_on, "HIGH"],
          [Blockly.Msg.senseBox_off, "LOW"],
        ]),
        "STAT",
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_fluoro_tooltip);
  },
};

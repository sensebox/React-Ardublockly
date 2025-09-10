import * as Blockly from "blockly";
import { getColour } from "@/components/Blockly/helpers/colour";
import { selectedBoard } from "@/components/Blockly/helpers/board";
import { Block } from "..";

Blockly.Blocks["sensebox_fluoroASM_init"] = {
  init: function () {
    this.appendDummyInput().appendField("Init FluoroASM Bee");
    this.setColour("#c67d3f");

    this.appendDummyInput()
      .appendField("Filter aktiv")
      .appendField(
        new Blockly.FieldCheckbox("FALSE", function (value) {
          window.dispatchRedux?.({
            type: "FLUORO_SET_FILTER_ENABLED",
            payload: value === "TRUE",
          });
        }),
        "FILTER_ACTIVE",
      );

    this.appendDummyInput()
      .appendField("Filter an:")
      .appendField(
        new Blockly.FieldDropdown(
          [
            ["Led1", "LED1"],
            ["Led2", "LED2"],
            ["Led3", "LED3"],
            ["Led4", "LED4"],
          ],
          function (value) {
            const offsetMap = { LED1: 0, LED2: 13.4, LED3: 27.2, LED4: 40.4 };
            window.dispatchRedux?.({
              type: "FLUORO_SET_FILTER_OFFSET",
              payload: offsetMap[value],
            });
          },
        ),
        "FILTER_TARGET",
      );

    this.appendDummyInput()
      .appendField("Diamant aktiv")
      .appendField(
        new Blockly.FieldCheckbox("FALSE", function (value) {
          window.dispatchRedux?.({
            type: "FLUORO_SET_DIAMOND_ENABLED",
            payload: value === "TRUE",
          });
        }),
        "DIAMOND_ACTIVE",
      );

    this.appendDummyInput()
      .appendField("Filter Farbe:")
      .appendField(
        new Blockly.FieldDropdown(
          [
            ["Rot", "RED"],
            ["Grün", "GREEN"],
            ["Blau", "BLUE"],
          ],
          function (value) {
            const colorMap = {
              RED: "#f90c0c",
              GREEN: "#33FF33",
              BLUE: "#280cf9",
            };
            window.dispatchRedux?.({
              type: "FLUORO_SET_FILTER_COLOR",
              payload: colorMap[value],
            });
          },
        ),
        "FILTER_COLOR",
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_fluoro_tooltip);
  },
};

Blockly.Blocks["sensebox_fluoroASM_setLED"] = {
  init: function () {
    this.setColour("#c67d3f");

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

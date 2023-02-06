import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";

Blockly.Blocks["sensebox_rtc_init"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_rtc_init);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.sensebox_rtc_init_tooltip);
  },
};

Blockly.Blocks["sensebox_rtc_set"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_rtc_set);
    this.appendValueInput("second").appendField(
      Blockly.Msg.sensebox_rtc_second
    );
    this.appendValueInput("minutes").appendField(
      Blockly.Msg.sensebox_rtc_minutes
    );
    this.appendValueInput("hour").appendField(Blockly.Msg.sensebox_rtc_hour);
    this.appendValueInput("day").appendField(Blockly.Msg.sensebox_rtc_day);
    this.appendValueInput("month").appendField(Blockly.Msg.sensebox_rtc_month);
    this.appendValueInput("year").appendField(Blockly.Msg.sensebox_rtc_year);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.sensebox_rtc_set_tooltip);
  },
};

Blockly.Blocks["sensebox_rtc_set_ntp"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendValueInput("time").appendField(Blockly.Msg.sensebox_rtc_set_ntp);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.sensebox_rtc_set_ntp_tooltip);
  },
};

Blockly.Blocks["sensebox_rtc_get"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_rtc_get)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.sensebox_rtc_hour, "hour"],
          [Blockly.Msg.sensebox_rtc_minutes, "minutes"],
          [Blockly.Msg.sensebox_rtc_second, "seconds"],
          [Blockly.Msg.sensebox_rtc_day, "day"],
          [Blockly.Msg.sensebox_rtc_month, "month"],
          [Blockly.Msg.sensebox_rtc_year, "year"],
        ]),
        "dropdown"
      );
    this.setOutput(true, Types.LARGE_NUMBER.typeName);
    this.setTooltip(Blockly.Msg.sensebox_rtc_get_tooltip);
  },
};

Blockly.Blocks["sensebox_rtc_get_timestamp"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_rtc_get_timestamp);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.sensebox_rtc_get_timestamp_tooltip);
  },
};

/**
 *  Internal RTC
 *
 */

Blockly.Blocks["sensebox_internal_rtc_init"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_internal_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_internal_rtc_init);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.sensebox_internal_rtc_init_tooltip);
  },
};

Blockly.Blocks["sensebox_internal_rtc_set"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendValueInput("time").appendField(
      Blockly.Msg.sensebox_internal_rtc_set
    );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.sensebox_internal_rtc_set_tooltip);
  },
};

Blockly.Blocks["sensebox_internal_rtc_get"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_internal_rtc_get)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.sensebox_internal_rtc_epoch, "Epoch"],
          [Blockly.Msg.sensebox_internal_rtc_year, "Year"],
          [Blockly.Msg.sensebox_internal_rtc_month, "Month"],
          [Blockly.Msg.sensebox_internal_rtc_day, "Day"],
          [Blockly.Msg.sensebox_internal_rtc_hour, "Hours"],
          [Blockly.Msg.sensebox_internal_rtc_minutes, "Minutes"],
          [Blockly.Msg.sensebox_internal_rtc_seconds, "Seconds"],
        ]),
        "dropdown"
      );
    this.setOutput(true, Types.LARGE_NUMBER.typeName);
    this.setTooltip(Blockly.Msg.sensebox_internal_rtc_get_tooltip);
  },
};

Blockly.Blocks["sensebox_internal_rtc_get_timestamp"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_internal_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_internal_rtc_get_timestamp
    );
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.sensebox_internal_rtc_get_timestamp_tooltip);
  },
};

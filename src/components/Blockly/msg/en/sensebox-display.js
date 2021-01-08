import Blockly from 'blockly';

/**
 * Display
 */

Blockly.Msg.senseBox_display_beginDisplay = "Initialize Display";
Blockly.Msg.senseBox_display_beginDisplay_tooltip = `Connect the Display to one of the five **I2C-Ports**. Use this Block inside the setup()-function.`
Blockly.Msg.senseBox_display_clearDisplay_tooltip = "Löscht die Anzeige auf dem Display. Sollte immer zu Begin oder am Ende der Endlosschleife aufgerufen werden.";
Blockly.Msg.senseBox_display_clearDisplay = "Clear Display";
Blockly.Msg.senseBox_display_printDisplay = "Show Text/Number";
Blockly.Msg.senseBox_display_printDisplay_tooltip = "Shows a number/text on the display. The position on the display can be determined via the X and Y coordinates. The font size can be set in integer values between 1 and 4. The display has a resolution of 128x64 pixels (X and Y axis).";
Blockly.Msg.senseBox_display_printDisplay_x = "x-Coordinates";
Blockly.Msg.senseBox_display_printDisplay_y = "y-Coordinates";
Blockly.Msg.senseBox_display_printDisplay_value = "Value";
Blockly.Msg.senseBox_display_setSize = "Fontsize";
Blockly.Msg.senseBox_display_setSize_tip = "Change the fontsize with a value between 1 and 4";
Blockly.Msg.senseBox_display_color = "Font color";
Blockly.Msg.senseBox_display_white = "White";
Blockly.Msg.senseBox_display_black = "Black";
Blockly.Msg.sensebox_display_show = "Print on display";
Blockly.Msg.sensebox_display_show_tip = "Show the following content on the Display";
Blockly.Msg.senseBox_dipslay_plotTitle = "Title";
Blockly.Msg.senseBox_display_plotDisplay = "Plot Diagram";
Blockly.Msg.senseBox_display_plotXLabel = "X-Axis Label";
Blockly.Msg.senseBox_display_plotYLabel = "Y-Axis Label";
Blockly.Msg.senseBox_display_plotXRange1 = "X-Range Begin";
Blockly.Msg.senseBox_display_plotXRange2 = "X-Range End";
Blockly.Msg.senseBox_display_plotYRange1 = "Y-Range Begin";
Blockly.Msg.senseBox_display_plotYRange2 = "Y-Range End";
Blockly.Msg.senseBox_display_plotXTick = "X-Linienabstand";
Blockly.Msg.senseBox_display_plotYTick = "Y-Tick";
Blockly.Msg.senseBox_display_plotXTick = "X-Tick";
Blockly.Msg.senseBox_display_printDisplay_tooltip = "Use this Block to plot values on the OLED Display"
Blockly.Msg.senseBox_display_plotTimeFrame = "TimeFrame";
Blockly.Msg.sensebox_display_fillCircle = "Draw Point";
Blockly.Msg.sensebox_display_fillCircle_radius = "Radius";
Blockly.Msg.senseBox_display_fillCircle_tooltip = "This block can be used to show a point on the display. You can use the coordinates to place the point on the display and use the radius to determine the size."
Blockly.Msg.sensebox_display_drawRectangle = "Draw Rectangle";
Blockly.Msg.sensebox_display_drawRectangle_width = "Width";
Blockly.Msg.sensebox_display_drawRectangle_height = "Height";
Blockly.Msg.senseBox_display_drawRectangle_tooltip = "This block draws a rectangle on the display. The X and Y coordinates are used to determine the position of the top left corner of the rectangle on the display. The height and width are specified in pixels and the 'Filled' checkbox can be used to select whether the rectangle is filled or just displayed as a frame."
Blockly.Msg.senseBox_display_filled = "filled";
Blockly.Msg.senseBox_display_fastPrint_show = "Show Measurements";
Blockly.Msg.senseBox_display_fastPrint_title = "Title";
Blockly.Msg.senseBox_display_fastPrint_value = "Value";
Blockly.Msg.senseBox_display_fastPrint_dimension = "Unit";
Blockly.Msg.sensebox_display_fastPrint_tooltip = "Show two measurements with title and dimension on the display"
Blockly.Msg.senseBox_display_helpurl = "https://en.docs.sensebox.de/blockly/blockly-display/"







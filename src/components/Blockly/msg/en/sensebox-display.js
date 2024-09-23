export const DISPLAY = {

    /**
     * Display
     */

    senseBox_display_beginDisplay: "Initialize Display",
    senseBox_display_beginDisplay_tooltip: `Connect the Display to one of the **I2C-Ports**. Use this Block inside the setup()-function.`,
    senseBox_display_clearDisplay_tooltip: "Löscht die Anzeige auf dem Display. Sollte immer zu Begin oder am Ende der Endlosschleife aufgerufen werden.",
    senseBox_display_clearDisplay: "Clear Display",
    senseBox_display_printDisplay: "Show Text/Number",
    senseBox_display_printDisplay_tooltip: "Shows a number/text on the display. The position on the display can be determined via the X and Y coordinates. The font size can be set in integer values between 1 and 4. The display has a resolution of 128x64 pixels (X and Y axis).",
    senseBox_display_printDisplay_x: "x-Coordinates",
    senseBox_display_printDisplay_y: "y-Coordinates",
    senseBox_display_printDisplay_value: "Value",
    senseBox_display_setSize: "Fontsize",
    senseBox_display_setSize_tip: "Change the fontsize with a value between 1 and 4",
    senseBox_display_color: "Font color",
    senseBox_display_white: "White",
    senseBox_display_black: "Black",
    sensebox_display_show: "Print on display",
    sensebox_display_show_tip: "Show the following content on the Display",
    senseBox_display_plotTitle: "Title",
    senseBox_display_plotDisplay: "Plot Diagram",
    senseBox_display_plotXLabel: "X-Axis Label",
    senseBox_display_plotYLabel: "Y-Axis Label",
    senseBox_display_plotXRange1: "X-Range Begin",
    senseBox_display_plotXRange2: "X-Range End",
    senseBox_display_plotYRange1: "Y-Range Begin",
    senseBox_display_plotYRange2: "Y-Range End",
    senseBox_display_plotYTick: "Y-Tick",
    senseBox_display_plotXTick: "X-Tick",
    senseBox_display_plotTimeFrame: "TimeFrame",
	senseBox_display_plotDisplay_tooltip: "Plots a diagram on the screen. The 'Title' is positioned above the diagram and the 'Axis label' next to the respective axis. The x-axis shows the elapsed time in seconds. You define what is displayed on the y-axis under 'Value'. The x-range and the y-range define the range in which the data is to be displayed on the screen. For example, if a value of 700 is measured, but the y-range is only defined from 0 to 500, the measurement will not be displayed. The 'Tick' for x and y specifies the intervals at which lines and numbers are placed on the axis. This is mainly for clarity and the ability to roughly read off the values. Bear in mind that the display is very small and therefore cannot show many values. The 'TimeFrame' defines how long the values are to be measured. After that many seconds, the diagram is reset and new values are measured and displayed. It is best to use the 'x-range end' as a guide. This is because if the 'TimeFrame' is larger, you can no longer see the values on the display. If the 'time period' is smaller or the same size, you have very little time to see the values on the display before they are deleted."
    sensebox_display_fillCircle: "Draw Point",
    sensebox_display_fillCircle_radius: "Radius",
    senseBox_display_fillCircle_tooltip: "This block can be used to show a point on the display. You can use the coordinates to place the point on the display and use the radius to determine the size.",
    sensebox_display_drawRectangle: "Draw Rectangle",
    sensebox_display_drawRectangle_width: "Width",
    sensebox_display_drawRectangle_height: "Height",
    senseBox_display_drawRectangle_tooltip: "This block draws a rectangle on the display. The X and Y coordinates are used to determine the position of the top left corner of the rectangle on the display. The height and width are specified in pixels and the 'Filled' checkbox can be used to select whether the rectangle is filled or just displayed as a frame.",
    senseBox_display_filled: "filled",
    senseBox_display_fastPrint_show: "Show Measurements",
    senseBox_display_fastPrint_title: "Title",
    senseBox_display_fastPrint_value: "Value",
    senseBox_display_fastPrint_dimension: "Unit",
    sensebox_display_fastPrint_tooltip: "Show two measurements with title and dimension on the display",
    senseBox_display_helpurl: "https://en.docs.sensebox.de/blockly/blockly-display/"

}
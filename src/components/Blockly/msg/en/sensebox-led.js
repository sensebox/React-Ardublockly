import Blockly from 'blockly'



Blockly.Msg.senseBox_led = "LED connected to digital";
Blockly.Msg.senseBox_led_tip = "simple LED. Don't forget the resistor";

Blockly.Msg.senseBox_rgb_led = "RGB-LED";
Blockly.Msg.senseBox_rgb_led_tip = "RGB-LED";

/**
 * WS2818 RGB LED
 */
Blockly.Msg.senseBox_ws2818_rgb_led = "Set RGB-LED at";
Blockly.Msg.senseBox_ws2818_rgb_led_init = "Initialise RGB LED (WS2818)";
Blockly.Msg.senseBox_ws2818_rgb_led_position = "Position";
Blockly.Msg.senseBox_ws2818_rgb_led_brightness = "Brightness";
Blockly.Msg.senseBox_ws2818_rgb_led_tooltip = "Change the color of your RGB LED with this block. Link a block for the color. If multiple RGB LEDs are chained together you can use the position to determine which LED is controlled. "
Blockly.Msg.senseBox_ws2818_rgb_led_init_tooltip = "Connect the RGB LED to one of the three **digital/analog ports**. If multiple RGB LEDs are daisy-chained together you can determine which LED is controlled by position. "
Blockly.Msg.senseBox_ws2818_rgb_led_color = "Color"
Blockly.Msg.senseBox_ws2818_rgb_led_number = "Number"

/**
 * Color
 */

Blockly.Msg.COLOUR_BLEND_COLOUR1 = "colour 1";
Blockly.Msg.COLOUR_BLEND_COLOUR2 = "colour 2";
Blockly.Msg.COLOUR_BLEND_HELPURL = "http://meyerweb.com/eric/tools/color-blend/";
Blockly.Msg.COLOUR_BLEND_RATIO = "ratio";
Blockly.Msg.COLOUR_BLEND_TITLE = "blend";
Blockly.Msg.COLOUR_BLEND_TOOLTIP = "Blends two colours together with a given ratio (0.0 - 1.0).";
Blockly.Msg.COLOUR_PICKER_HELPURL = "https://en.wikipedia.org/wiki/Color";
Blockly.Msg.COLOUR_PICKER_TOOLTIP = "Choose a colour from the palette.";
Blockly.Msg.COLOUR_RANDOM_HELPURL = "http://randomcolour.com";
Blockly.Msg.COLOUR_RANDOM_TITLE = "random colour";
Blockly.Msg.COLOUR_RANDOM_TOOLTIP = "Choose a colour at random.";
Blockly.Msg.COLOUR_RGB_BLUE = "blue";
Blockly.Msg.COLOUR_RGB_GREEN = "green";
Blockly.Msg.COLOUR_RGB_HELPURL = "http://www.december.com/html/spec/colorper.html";
Blockly.Msg.COLOUR_RGB_RED = "red";
Blockly.Msg.COLOUR_RGB_TITLE = "colour with";
Blockly.Msg.COLOUR_RGB_TOOLTIP = "Create a colour with the specified amount of red, green, and blue. All values must be between 0 and 255.";

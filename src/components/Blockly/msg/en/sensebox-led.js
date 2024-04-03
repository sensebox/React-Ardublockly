export const LED = {
  senseBox_led: `LED connected to`,
  senseBox_led_tip: `simple LED. Don't forget the resistor`,

  senseBox_rgb_led: `RGB-LED`,
  senseBox_rgb_led_tip: `RGB-LED`,

  /**
   * WS2818 RGB LED
   */
  senseBox_ws2818_rgb_led: `Set RGB-LED at`,
  senseBox_ws2818_rgb_led_init: `Initialise RGB LED (WS2818)`,
  senseBox_ws2818_rgb_led_position: `Position`,
  senseBox_ws2818_rgb_led_brightness: `Brightness`,
  senseBox_ws2818_rgb_led_tooltip:
    `Change the color of your RGB LED with this block. Link a block for the color. If multiple RGB LEDs are chained together you can use the position to determine which LED is controlled.`,
  senseBox_ws2818_rgb_led_init_tooltip:
    `Connect the RGB LED to one of the **digital/analog ports**. If multiple RGB LEDs are daisy-chained together you can determine which LED is controlled by position.`,
  senseBox_ws2818_rgb_led_color: `Color`,
  senseBox_ws2818_rgb_led_number: `Number`,

  /**
   * Color
   */

  COLOUR_BLEND_COLOUR1: `colour 1`,
  COLOUR_BLEND_COLOUR2: `colour 2`,
  COLOUR_BLEND_HELPURL: `http://meyerweb.com/eric/tools/color-blend/`,
  COLOUR_BLEND_RATIO: `ratio`,
  COLOUR_BLEND_TITLE: `blend`,
  COLOUR_BLEND_TOOLTIP:
    `Blends two colours together with a given ratio (0.0 - 1.0).`,
  COLOUR_PICKER_HELPURL: `https://en.wikipedia.org/wiki/Color`,
  COLOUR_PICKER_TOOLTIP: `Choose a colour from the palette.`,
  COLOUR_RANDOM_HELPURL: `http://randomcolour.com`,
  COLOUR_RANDOM_TITLE: `random colour`,
  COLOUR_RANDOM_TOOLTIP: `Choose a colour at random.`,
  COLOUR_RGB_BLUE: `blue`,
  COLOUR_RGB_GREEN: `green`,
  COLOUR_RGB_HELPURL: `http://www.december.com/html/spec/colorper.html`,
  COLOUR_RGB_RED: `red`,
  COLOUR_RGB_TITLE: `colour with`,
  COLOUR_RGB_TOOLTIP:
    `Create a colour with the specified amount of red, green, and blue. All values must be between 0 and 255.`,
  /**
     * LED-Matrix
     */


  senseBox_ws2812_rgb_matrix_init: `Initialise LED-Matrix`,
  senseBox_ws2812_rgb_matrix_print: `Show text/number`,
  senseBox_ws2812_rgb_matrix_text: `Input`,
  senseBox_ws2812_rgb_matrix_init_tooltip: `Connect the LED-Matrix to one of the **digital/analog ports**. Use this Block inside the setup()-function.`,
  senseBox_ws2812_rgb_matrix_brightness: `Brightness: `,
  senseBox_ws2812_rgb_matrix_print_tooltip: `Shows a number/text on the display.
  If the 'Auto-Scroll' checkbox is ticked, the input moves from right to left across the LED-matrix. This is helpful to display long input. 
  Blocks after this one will only be executed once the entire input has moved across the matrix.`,
  senseBox_ws2812_rgb_matrix_autoscroll: `Auto-Scroll`,
  senseBox_ws2812_rgb_matrix_draw_pixel: `Set pixels`,
  senseBox_ws2812_rgb_matrix_draw_pixel_tooltip: `Color a pixel at the position (X,Y).
  Along the X-axis the LED-Matrix has 12 pixels and on the Y-axis 8.
  You can find the single color block in the LED category.`,
  senseBox_ws2812_rgb_matrix_x: `X`,
  senseBox_ws2812_rgb_matrix_y: `Y`,
  senseBox_ws2812_rgb_matrix_color: `Color`,
  senseBox_ws2812_rgb_matrix_clear: `Clear matrix`,
  senseBox_ws2812_rgb_matrix_clear_tooltip: `Color all pixels of the LED-Matrix black.`,
  senseBox_ws2812_rgb_matrix_show_bitmap: `Draw bitmap`,
  senseBox_ws2812_rgb_matrix_show_bitmap_tooltip: `Display a bitmap of color values on the LED-Matrix.
  For example, display the **Motive** or **Write/Paint your own bitmap** blocks from the LED-Matrix category. Alternatively, the ToF Distance Imager can also output a bitmap.`,
  senseBox_ws2812_rgb_matrix_bitmap: `Motive`,
  senseBox_ws2812_rgb_matrix_bitmap_tooltip: `Contains a selection of predefined color value bitmaps`,
  senseBox_ws2812_rgb_matrix_custom_bitmap_tooltip: `color values have to be given in the RGB565 format. The LED-Matrix has 8x12 Pixels, so the bitmap should to contain 96 color values.`,
  senseBox_ws2812_rgb_matrix_custom_bitmap: `Write a custom bitmap`,
  senseBox_ws2812_rgb_matrix_custom_bitmap_example: `{0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xB5B6,   // 0x0010 (16) pixels\n` +
  `0x0000, 0x0000, 0x29B3, 0x29B3, 0x29B3, 0x0000, 0x0000, 0x0000, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3,` +  // 0x0020 (32) pixels`+
  `0x29B3, 0x74DA, 0x74DA, 0x74DA, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0x0000, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x74DA, 0x74DA,   // 0x0030 (48) pixels `+
  `0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x0000, 0x0000, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6,   // 0x0040 (64) pixels ` +
  `0x0000, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x74DA, 0x74DA, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3,   // 0x0050 (80) pixels`   +
  `0x29B3, 0x74DA, 0x74DA, 0x74DA, 0x0000, 0x0000, 0x0000, 0xB5B6, 0x0000, 0x0000, 0x29B3, 0x29B3, 0x29B3, 0x0000, 0x0000, 0x0000,   // 0x0060 (96) pixels}`,
  senseBox_ws2812_rgb_matrix_draw_bitmap: `Paint a custom Bitmap`,
  senseBox_ws2812_rgb_matrix_draw_bitmap_tooltip: `Select colors for individual pixels.`,
};

export const LED = {
  /**
   * WS2818 RGB LED
   */
  senseBox_ws2818_rgb_led: "Setze RGB-LED (onBoard) an",
  senseBox_ws2818_rgb_led_init: "RGB LED (onBoard) initialisieren",
  senseBox_ws2818_rgb_led_position: "Position",
  senseBox_ws2818_rgb_led_brightness: "Helligkeit",
  senseBox_ws2818_rgb_led_tooltip:
    "Verändere mit diesem Block die Farbe deiner RGB-LED. Verbinde einen Block für die Farbe. Wenn mehrere RGB-LEDs miteinander verkettet werden kannst du über die Position bestimmen welche LED angesteuert wird. ",
  senseBox_ws2818_rgb_led_init_tooltip:
    "Schließe die RGB-LED an einen der drei **digital/analog Ports** an. Wenn mehrere RGB-LEDs miteinander verkettet werden kannst du über die Position bestimmen welche LED angesteuert wird. ",
  senseBox_ws2818_rgb_led_color: "Farbe",
  senseBox_ws2818_rgb_led_number: "Anzahl",

  /**
   * Color
   */

  COLOUR_BLEND_COLOUR1: "Farbe 1",
  COLOUR_BLEND_COLOUR2: "mit Farbe 2",
  COLOUR_BLEND_HELPURL: "http://meyerweb.com/eric/tools/color-blend/",
  COLOUR_BLEND_RATIO: "im Verhältnis",
  COLOUR_BLEND_TITLE: "mische",
  COLOUR_BLEND_TOOLTIP:
    "Vermische 2 Farben mit konfigurierbaren Farbverhältnis (0.0 - 1.0).",
  COLOUR_PICKER_HELPURL: "https://de.wikipedia.org/wiki/Farbe",
  COLOUR_PICKER_TOOLTIP:
    "Wähle eine Farbe aus der Palette. Die Farbe wird automatisch in RGB-Werte konvertiert.",
  COLOUR_RANDOM_HELPURL: "http://randomcolour.com", // untranslated
  COLOUR_RANDOM_TITLE: "zufällige Farbe",
  COLOUR_RANDOM_TOOLTIP: "Erstelle eine Farbe nach dem Zufallsprinzip.",
  COLOUR_RGB_BLUE: "blau",
  COLOUR_RGB_GREEN: "grün",
  COLOUR_RGB_HELPURL: "https://de.wikipedia.org/wiki/RGB-Farbraum",
  COLOUR_RGB_RED: "rot",
  COLOUR_RGB_TITLE: "Farbe mit",
  COLOUR_RGB_TOOLTIP:
    "Erstelle eine Farbe mit selbst definierten Rot-, Grün- und Blauwerten. Alle Werte müssen zwischen 0 und 255 liegen. 0 ist hierbei die geringte Intensität der Farbe 255 die höchste.",

    /**
     * LED-Matrix
     */


    senseBox_ws2812_rgb_matrix_init: "LED-Matrix initialisieren",
    senseBox_ws2812_rgb_matrix_print: "Zeige Text/Zahl",
    senseBox_ws2812_rgb_matrix_text: "Input",
    senseBox_ws2812_rgb_matrix_init_tooltip: "",
    senseBox_ws2812_rgb_matrix_brightness: "Helligkeit: ",
    senseBox_ws2812_rgb_matrix_print_tooltip: "",
    senseBox_ws2812_rgb_matrix_autoscroll: "Auto-Scroll",
    senseBox_ws2812_rgb_matrix_draw_pixel: "Pixel setzen",
    senseBox_ws2812_rgb_matrix_x: "X",
    senseBox_ws2812_rgb_matrix_y: "Y",
    senseBox_ws2812_rgb_matrix_color: "Farbe",
    senseBox_ws2812_rgb_matrix_clear: "Matrix leeren",
    senseBox_ws2812_rgb_matrix_clear_tooltip: "",
    senseBox_ws2812_rgb_matrix_draw_bitmap: "Zeichne Bitmap",
    senseBox_ws2812_rgb_matrix_draw_bitmap_tooltip: "",
    senseBox_ws2812_rgb_matrix_bitmap: "Motiv",
    senseBox_ws2812_rgb_matrix_bitmap_tooltip: "",
    senseBox_ws2812_rgb_matrix_custom_bitmap_tooltip: "",
    senseBox_ws2812_rgb_matrix_custom_bitmap: "Zeige eigene Bitmap",
    senseBox_ws2812_rgb_matrix_custom_bitmap_example: "{0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xB5B6,   // 0x0010 (16) pixels\n" +
    "0x0000, 0x0000, 0x29B3, 0x29B3, 0x29B3, 0x0000, 0x0000, 0x0000, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3," +  // 0x0020 (32) pixels"+
    "0x29B3, 0x74DA, 0x74DA, 0x74DA, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0x0000, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x74DA, 0x74DA,   // 0x0030 (48) pixels "+
    "0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x0000, 0x0000, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6,   // 0x0040 (64) pixels " +
    "0x0000, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x74DA, 0x74DA, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3,   // 0x0050 (80) pixels"   +
    "0x29B3, 0x74DA, 0x74DA, 0x74DA, 0x0000, 0x0000, 0x0000, 0xB5B6, 0x0000, 0x0000, 0x29B3, 0x29B3, 0x29B3, 0x0000, 0x0000, 0x0000,   // 0x0060 (96) pixels}",


};

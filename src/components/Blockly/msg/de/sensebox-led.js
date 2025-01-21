export const LED = {
  /**
   * WS2818 RGB LED
   */
  senseBox_ws2818_rgb_led: `Setze RGB-LED (WS2818) an`,
  senseBox_ws2818_rgb_led_init: `RGB LED (WS2818) initialisieren`,
  senseBox_ws2818_rgb_led_position: `Position`,
  senseBox_ws2818_rgb_led_brightness: `Helligkeit`,
  senseBox_ws2818_rgb_led_tooltip: `Verändere mit diesem Block die Farbe deiner RGB-LED. Verbinde einen Block für die Farbe. Wenn mehrere RGB-LEDs miteinander verkettet werden kannst du über die Position bestimmen welche LED angesteuert wird. `,
  senseBox_ws2818_rgb_led_init_tooltip: `Schließe die RGB-LED an einen der **digital/analog Ports** an. Wenn mehrere RGB-LEDs miteinander verkettet werden kannst du über die Position bestimmen welche LED angesteuert wird. `,
  senseBox_ws2818_rgb_led_color: `Farbe`,
  senseBox_ws2818_rgb_led_number: `Anzahl`,
  senseBox_ws2818_rgb_led_helpurl:
    "https://docs.sensebox.de/docs/hardware/accessoires/rgb-led-esp32",
  senseBox_ws2818_rgb_led_helpurl_2:
    "https://docs.sensebox.de/docs/hardware/accessoires/rgb-led",

  /**
   * Color
   */

  COLOUR_BLEND_COLOUR1: `Farbe 1`,
  COLOUR_BLEND_COLOUR2: `mit Farbe 2`,
  COLOUR_BLEND_HELPURL: `http://meyerweb.com/eric/tools/color-blend/`,
  COLOUR_BLEND_RATIO: `im Verhältnis`,
  COLOUR_BLEND_TITLE: `mische`,
  COLOUR_BLEND_TOOLTIP: `Vermische 2 Farben mit konfigurierbaren Farbverhältnis (0.0 - 1.0).`,
  COLOUR_PICKER_HELPURL: `https://de.wikipedia.org/wiki/Farbe`,
  COLOUR_PICKER_TOOLTIP: `Wähle eine Farbe aus der Palette. Die Farbe wird automatisch in RGB-Werte konvertiert.`,
  COLOUR_RANDOM_HELPURL: `http://randomcolour.com`, // untranslated
  COLOUR_RANDOM_TITLE: `zufällige Farbe`,
  COLOUR_RANDOM_TOOLTIP: `Erstelle eine Farbe nach dem Zufallsprinzip.`,
  COLOUR_RGB_BLUE: `blau`,
  COLOUR_RGB_GREEN: `grün`,
  COLOUR_RGB_HELPURL: `https://de.wikipedia.org/wiki/RGB-Farbraum`,
  COLOUR_RGB_RED: `rot`,
  COLOUR_RGB_TITLE: `Farbe mit`,
  COLOUR_RGB_TOOLTIP: `Erstelle eine Farbe mit selbst definierten Rot-, Grün- und Blauwerten. Alle Werte müssen zwischen 0 und 255 liegen. 0 ist hierbei die geringte Intensität der Farbe 255 die höchste.`,

  /**
   * LED-Matrix
   */

  senseBox_ws2812_rgb_matrix_init: `LED-Matrix initialisieren`,
  senseBox_ws2812_rgb_matrix_print: `Zeige Text/Zahl`,
  senseBox_ws2812_rgb_matrix_text: `Input`,
  senseBox_ws2812_rgb_matrix_init_tooltip: `Schließe die LED-Matrix an einen der **digital/analog Ports** an. Dieser Block muss im Setup() verwendet werden.`,
  senseBox_ws2812_rgb_matrix_brightness: `Helligkeit: `,
  senseBox_ws2812_rgb_matrix_print_tooltip: `Zeigt eine Zahl/Text auf dem Display an. 
    Wenn ein Häkchen am 'Auto-Scroll' gesetzt  wurde, wandert der anzuzeigende Input von rechts nach links über die Matrix. Dies ist hilfreich um langen Input anzuzeigen. Nachfolgender Code wird erst ausgeführt, wenn der gesamte Input über die Matrix gewandert ist.
    Beim Feld 'Color' kannst du eine Farbe für deinen Input wählen.`,
  senseBox_ws2812_rgb_matrix_autoscroll: `Auto-Scroll`,
  senseBox_ws2812_rgb_matrix_draw_pixel: `Pixel setzen`,
  senseBox_ws2812_rgb_matrix_draw_pixel_tooltip: `Färbe ein Pixel an der Position (X,Y).
    Entlang der X-Achse hat die LED-Matrix 12 Pixel und auf der Y-Achse 8.
    Ein Block zum auswählen der Farbe befindet sich in der LED Kategorie.
    Wenn du kein Häkchen an 'Zeige sofort' sofort setzt wird die Färbung des Pixels nur vorgemerkt und noch nicht dargestellt.
    Dies ist hilfreich wenn du viele Pixel auf einmal färben möchtest, da die LED-Matrix sonst jedesmal flackert wenn du ein Pixel färbst.
    Falls du also mehrere Pixel färbst, solltest du nur beim letzten Block das Häkchen setzen.`,
  senseBox_ws2812_rgb_matrix_show: `Zeige sofort`,
  senseBox_ws2812_rgb_matrix_x: `X`,
  senseBox_ws2812_rgb_matrix_y: `Y`,
  senseBox_ws2812_rgb_matrix_color: `Farbe`,
  senseBox_ws2812_rgb_matrix_clear: `Matrix leeren`,
  senseBox_ws2812_rgb_matrix_clear_tooltip: `Setzt alle Pixel der LED-Matrix auf schwarz.`,
  senseBox_ws2812_rgb_matrix_show_bitmap: `Zeige Bitmap`,
  senseBox_ws2812_rgb_matrix_show_bitmap_tooltip: `Zeige eine Bitmap an Farbwerten auf der LED-Matrix an.
    Beispielsweise die Blöcke **Motiv** oder **Schreibe/Male eine eigene Bitmap** aus der LED-Matrix Kategorie. Alternativ kann auch der ToF Distanz Imager eine Bitmap ausgeben.`,
  senseBox_ws2812_rgb_matrix_bitmap: `Motiv`,
  senseBox_ws2812_rgb_matrix_bitmap_tooltip: `Enthält eine Auswahl an vordefinierten Farbwert-Bitmaps.`,
  senseBox_ws2812_rgb_matrix_custom_bitmap_tooltip: `Farbwerte müssen im RGB565 Format angegeben werden. Die LED-Matrix hat 8x12 Pixel, die Bitmap sollte also 96 Farbwerte enthalten.`,
  senseBox_ws2812_rgb_matrix_custom_bitmap: `Schreibe eine eigene Bitmap`,
  senseBox_ws2812_rgb_matrix_custom_bitmap_example:
    `{0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xB5B6,` +
    `0x0000, 0x0000, 0x29B3, 0x29B3, 0x29B3, 0x0000, 0x0000, 0x0000, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3,` +
    `0x29B3, 0x74DA, 0x74DA, 0x74DA, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0x0000, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x74DA, 0x74DA, ` +
    `0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x0000, 0x0000, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6,` +
    `0x0000, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x74DA, 0x74DA, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3,` +
    `0x29B3, 0x74DA, 0x74DA, 0x74DA, 0x0000, 0x0000, 0x0000, 0xB5B6, 0x0000, 0x0000, 0x29B3, 0x29B3, 0x29B3, 0x0000, 0x0000, 0x0000}`,
  senseBox_ws2812_rgb_matrix_draw_bitmap: `Male eine eigene Bitmap`,
  senseBox_ws2812_rgb_matrix_draw_bitmap_tooltip: `Wähle anzuzeigende Farben für die einzelnen Pixel aus.`,
  senseBox_ws2812_rgb_matrix_helpurl:
    "https://docs.sensebox.de/docs/hardware/accessoires/led-matrix",
  sensebox_led_custom_bitmap: "Bitmap Name",
};

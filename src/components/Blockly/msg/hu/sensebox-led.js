export const LED = {
  senseBox_led: "LED csatlakoztatva",
  senseBox_led_tip: "egyszerű LED. Ne felejtsd el az ellenállást",

  senseBox_rgb_led: "RGB-LED",
  senseBox_rgb_led_tip: "RGB-LED",

  /**
   * WS2818 RGB LED
   */
  senseBox_ws2818_rgb_led: "Set RGB-LED at",
  senseBox_ws2818_rgb_led_init: "RGB LED inicializálása (WS2818)",
  senseBox_ws2818_rgb_led_position: "Pozíció",
  senseBox_ws2818_rgb_led_brightness: "Brightness: Fényerő",
  senseBox_ws2818_rgb_led_tooltip:
    "Az RGB LED színének megváltoztatása ezzel a blokkal. Linkelje a színhez tartozó blokkot. Ha több RGB LED van egymáshoz láncolva, akkor a pozíció segítségével meghatározhatja, hogy melyik LED-et vezérli.",
  senseBox_ws2818_rgb_led_init_tooltip:
    "Csatlakoztassa az RGB LED-et a három **digitális/analóg port** egyikéhez. Ha több RGB LED van egymáshoz fűzve, akkor a pozíció alapján meghatározhatja, hogy melyik LED-et vezérli.",
  senseBox_ws2818_rgb_led_color: "Szín",
  senseBox_ws2818_rgb_led_number: "Szám",

  /**
   * Szín
   */

  COLOUR_BLEND_COLOUR1: "szín 1",
  COLOUR_BLEND_COLOUR2: "szín 2",
  COLOUR_BLEND_HELPURL: "http://meyerweb.com/eric/tools/color-blend/",
  COLOUR_BLEND_RATIO: "arány",
  COLOUR_BLEND_TITLE: "blend",
  COLOUR_BLEND_TOOLTIP:
    "Két szín keverése adott arányban (0.0 - 1.0).",
  COLOUR_PICKER_HELPURL: "https://en.wikipedia.org/wiki/Color",
  COLOUR_PICKER_TOOLTIP: "Válasszon ki egy színt a palettáról.",
  COLOUR_RANDOM_HELPURL: "http://randomcolour.com",
  COLOUR_RANDOM_TITLE: "véletlen szín",
  COLOUR_RANDOM_TOOLTIP: "Véletlenszerű szín kiválasztása.",
  COLOUR_RGB_BLUE: "kék",
  COLOUR_RGB_GREEN: "zöld",
  COLOUR_RGB_HELPURL: "http://www.december.com/html/spec/colorper.html",
  COLOUR_RGB_RED: "red",
  COLOUR_RGB_TITLE: "színnel",
  COLOUR_RGB_TOOLTIP:
    "Hozzon létre egy színt a megadott mennyiségű vörössel, zölddel és kékkel. Minden értéknek 0 és 255 között kell lennie.",
};

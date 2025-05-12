import * as Blockly from "blockly/core";

/*Display Blocks*/
Blockly.Generator.Arduino.forBlock["sensebox_display_beginDisplay"] =
  function () {
    Blockly.Generator.Arduino.libraries_["library_spi"] = "#include <SPI.h>";
    Blockly.Generator.Arduino.libraries_["library_wire"] = "#include <Wire.h>";
    Blockly.Generator.Arduino.libraries_["library_AdafruitGFX"] =
      "#include <Adafruit_GFX.h> // http://librarymanager/All#Adafruit_GFX_Library";
    Blockly.Generator.Arduino.libraries_["library_AdafruitSSD1306"] =
      "#include <Adafruit_SSD1306.h> // http://librarymanager/All#Adafruit_SSD1306";
    Blockly.Generator.Arduino.definitions_["define_display_size"] =
      `#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64`;
    Blockly.Generator.Arduino.definitions_["define_display"] =
      "#define OLED_RESET -1\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);";

    Blockly.Generator.Arduino.setupCode_["sensebox_display_begin"] =
      "display.begin(SSD1306_SWITCHCAPVCC, 0x3D);\ndisplay.display();\ndelay(100);\ndisplay.clearDisplay();";
    var code = "";
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_display_clearDisplay"] =
  function () {
    var code = "display.clearDisplay();\n";
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_display_printDisplay"] =
  function () {
    var x = this.getFieldValue("X");
    var y = this.getFieldValue("Y");
    var printDisplay =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "printDisplay",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || '"Keine Eingabe"';
    var size = this.getFieldValue("SIZE");
    var color = this.getFieldValue("COLOR");
    var code = "display.setCursor(" + x + "," + y + ");\n";
    code += "display.setTextSize(" + size + ");\n";
    code += "display.setTextColor(" + color + ");\n";
    code += "display.println(" + printDisplay + ");\n";
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_display_fastPrint"] = function () {
  var title1 =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "Title1",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var value1 = Blockly.Generator.Arduino.valueToCode(
    this,
    "Value1",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  var dimension1 =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "Dimension1",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var title2 =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "Title2",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var value2 = Blockly.Generator.Arduino.valueToCode(
    this,
    "Value2",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  var dimension2 =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "Dimension2",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  Blockly.Generator.Arduino.codeFunctions_["sensebox_fastPrint"] = `
    void printOnDisplay(String title1, String measurement1, String unit1, String title2, String measurement2, String unit2) {
     
      display.setCursor(0, 0);
      display.setTextSize(1);
      display.setTextColor(WHITE, BLACK);
      display.println(title1);
      display.setCursor(0, 10);
      display.setTextSize(2);
      display.print(measurement1);
      display.print(" ");
      display.setTextSize(1);
      display.println(unit1);
      display.setCursor(0, 30);
      display.setTextSize(1);
      display.println(title2);
      display.setCursor(0, 40);
      display.setTextSize(2);
      display.print(measurement2);
      display.print(" ");
      display.setTextSize(1);
      display.println(unit2);
    }
    `;
  var code = ` printOnDisplay(${title1}, String(${value1}), ${dimension1}, ${title2}, String(${value2}), ${dimension2});\n`;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_display_show"] = function (
  block,
  generator,
) {
  var show = Blockly.Generator.Arduino.statementToCode(block, "SHOW");
  var code = "";
  code += show;
  code += "display.display();\n";
  return code;
};
Blockly.Generator.Arduino.forBlock["sensebox_display_plotDisplay"] =
  function () {
    var YLabel =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "YLabel",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "Y";
    var XLabel =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "XLabel",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "X";
    var Title =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Title",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "Title";
    var XRange1 =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "XRange1",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var XRange2 =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "XRange2",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var YRange1 =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "YRange1",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var YRange2 =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "YRange2",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var XTick =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "XTick",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var YTick =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "YTick",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var TimeFrame =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "TimeFrame",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var plotDisplay =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "plotDisplay",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || '"Keine Eingabe"';
    Blockly.Generator.Arduino.libraries_["library_plot"] = "#include <Plot.h>";
    Blockly.Generator.Arduino.definitions_["define_plot_class"] =
      "Plot DataPlot(&display);\n";
    Blockly.Generator.Arduino.variables_["define_plot_class"] =
      "const double TIMEFRAME = " + TimeFrame + ";\n";
    Blockly.Generator.Arduino.setupCode_["sensebox_plot_setup"] =
      "DataPlot.setTitle(" +
      Title +
      ");\nDataPlot.setXLabel(" +
      XLabel +
      ");\nDataPlot.setYLabel(" +
      YLabel +
      ");\nDataPlot.setXRange(" +
      XRange1 +
      "," +
      XRange2 +
      ");\nDataPlot.setYRange(" +
      YRange1 +
      "," +
      YRange2 +
      ");\nDataPlot.setXTick(" +
      XTick +
      ");\nDataPlot.setYTick(" +
      YTick +
      ");\nDataPlot.setXPrecision(0);\nDataPlot.setYPrecision(0);\n";
    var code = "DataPlot.clear();";
    code +=
      "double starttime = millis();\ndouble t = 0;\nwhile (t <= TIMEFRAME) {\nt = (millis() - starttime) / 1000.0;\nfloat value = " +
      plotDisplay +
      ";\n";
    code += "DataPlot.addDataPoint(t,value);\n}\n";
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_display_roboeyes"] = function () {
  Blockly.Generator.Arduino.definitions_["define_roboeyes"] =
    "#include <FluxGarage_RoboEyes.h>\n" + "roboEyes roboEyes;\n";
  Blockly.Generator.Arduino.setupCode_["sensebox_roboeye_setup"] =
    "roboEyes.begin(SCREEN_WIDTH, SCREEN_HEIGHT, 100);\n";
  let code = "";
  var position = this.getFieldValue("POSITION") || "DEFAULT";
  code += "roboEyes.setPosition(" + position + ");\n";
  var emotion = this.getFieldValue("EMOTION") || "DEFAULT";
  code += "roboEyes.setMood(" + emotion + ");\n";
  code +=
    "roboEyes.drawEyes();\n" +
    "roboEyes.drawEyes();\n" +
    "roboEyes.drawEyes();\n" +
    "roboEyes.drawEyes();\n";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_display_fillCircle"] =
  function () {
    let code = "";
    var x =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "X",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var y =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Y",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var radius =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Radius",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var fill = this.getFieldValue("FILL");
    if (fill === "TRUE") {
      code = "display.fillCircle(" + x + "," + y + "," + radius + ",1);\n";
    } else {
      code = "display.drawCircle(" + x + "," + y + "," + radius + ",1);\n";
    }
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_display_drawRectangle"] =
  function () {
    let code = "";
    var x =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "X",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var y =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "Y",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var width =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "width",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var height =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "height",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    var fill = this.getFieldValue("FILL");
    if (fill === "TRUE") {
      code =
        "display.fillRect(" +
        x +
        "," +
        y +
        "," +
        width +
        "," +
        height +
        ",1);\n";
    } else {
      code =
        "display.drawRect(" +
        x +
        "," +
        y +
        "," +
        width +
        "," +
        height +
        ",1);\n";
    }
    return code;
  };

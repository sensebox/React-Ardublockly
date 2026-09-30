export default function initBME680(interpreter, globalObject) {
    // Define readBME680Temperature function
    var wrapper = function readTemperatureBME680() {
      return document.getElementById("temp-bme680-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readTemperatureBME680",
      interpreter.createNativeFunction(wrapper),
    );
  
    // Define readBME680Humidity function
    var wrapper = function readHumidityBME680() {
      return document.getElementById("humidity-bme680-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readHumidityBME680",
      interpreter.createNativeFunction(wrapper),
    );

    // Define readBME680Pressure function
    var wrapper = function readPressureBME680() {
      return document.getElementById("pressure-bme680-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readPressureBME680",
      interpreter.createNativeFunction(wrapper),
    );

    // Define readBME680IAQ function
    var wrapper = function readIAQBME680() {
      return document.getElementById("iaq-bme680-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readIAQBME680",
      interpreter.createNativeFunction(wrapper),
    );



    // Define readBME680CO2Equivalent function
    var wrapper = function readCO2EquivalentBME680() {
      return document.getElementById("co2-bme680-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readCO2EquivalentBME680",
      interpreter.createNativeFunction(wrapper),
    );

    // Define readBME680BreathVOCEquivalent function
    var wrapper = function readBreathVOCEquivalentBME680() {
      return document.getElementById("voc-slider-bme680").value;
    };
    interpreter.setProperty(
      globalObject,
      "readBreathVOCEquivalentBME680",
      interpreter.createNativeFunction(wrapper),
    );
  }
import { defineSliderReaders } from "../slider";

// BME680 environmental sensor (BSEC values)
export default function initBME680(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readTemperatureBME680: "temp-bme680",
    readHumidityBME680: "humidity-bme680",
    readPressureBME680: "pressure-bme680",
    readIAQBME680: "iaq-bme680",
    readIAQAccuracyBME680: "iaqaccuracy-bme680",
    readCO2EquivalentBME680: "co2-bme680",
    readBreathVOCEquivalentBME680: "voc-bme680",
  });
}

/// <reference types="cypress" />

// Setup: display init. Loop: show the HDC1080 temperature on the display.
const displayTemperatureXml = (setupExtra = "") => `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_functions" deletable="false" id="start" x="27" y="16">
    <statement name="SETUP_FUNC">
      <block type="sensebox_display_beginDisplay" id="begin">${setupExtra}</block>
    </statement>
    <statement name="LOOP_FUNC">
      <block type="sensebox_display_show" id="show">
        <statement name="SHOW">
          <block type="sensebox_display_printDisplay" id="print">
            <field name="COLOR">WHITE,BLACK</field>
            <field name="SIZE">2</field>
            <field name="X">0</field>
            <field name="Y">0</field>
            <value name="printDisplay">
              <block type="sensebox_sensor_temp_hum" id="temp">
                <field name="NAME">Temperature</field>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`;

const wifiBlock = `
        <next>
          <block type="sensebox_wifi" id="wifi">
            <field name="SSID">SSID</field>
            <field name="Password">Password</field>
          </block>
        </next>`;

// Every simulated sensor value: [block type, dropdown field, values, node]
const SENSOR_VALUES = [
  [
    "sensebox_sensor_temp_hum",
    "NAME",
    ["Temperature", "Humidity"],
    "senseBox_hdc1080",
  ],
  [
    "sensebox_sensor_uv_light",
    "NAME",
    ["Illuminance", "UvIntensity"],
    "senseBox_lightUv",
  ],
  ["sensebox_sensor_watertemperature", null, [null], "senseBox_waterTemp"],
  ["sensebox_esp32s2_light", null, [null], "sensebox_esp32s2_light"],
  [
    "sensebox_sensor_ultrasonic_ranger",
    null,
    [null],
    "sensebox_sensor_ultrasonic_ranger",
  ],
  ["sensebox_tof_imager", "dropdown", ["DistanzCM"], "sensebox_tof_imager"],
  [
    "sensebox_sensor_bme680_bsec",
    "dropdown",
    [
      "temperature",
      "humidity",
      "pressure",
      "IAQ",
      "IAQAccuracy",
      "CO2",
      "breathVocEquivalent",
    ],
    "sensebox_sensor_bme680_bsec",
  ],
  [
    "sensebox_sensor_truebner_smt50_esp32",
    "value",
    ["temp", "soil"],
    "senseBox_smt50",
  ],
  [
    "sensebox_scd30",
    "dropdown",
    ["CO2", "temperature", "humidity"],
    "sensebox_scd30",
  ],
  [
    "sensebox_sensor_dps310",
    "NAME",
    ["Pressure", "Temperature", "Altitude"],
    "sensebox_sensor_dps310",
  ],
  [
    "sensebox_button",
    "FUNCTION",
    ["isPressed", "wasPressed", "longPress", "toggleButton"],
    null,
  ],
  [
    "sensebox_esp32s2_accelerometer",
    "value",
    ["accelerationX", "accelerationY", "accelerationZ", "temperature"],
    "sensebox_esp32s2_accelerometer",
  ],
  ["sensebox_sensor_sds011", "NAME", ["25", "10"], "sensebox_sensor_sds011"],
  [
    "sensebox_sensor_sps30",
    "value",
    ["1p0", "2p5", "4p0", "10p0"],
    "sensebox_sensor_sps30",
  ],
  [
    "sensebox_rg15_rainsensor",
    "VALUE",
    [
      "getTotalAccumulation",
      "getAccumulation",
      "getEventAccumulation",
      "getRainfallIntensity",
    ],
    "sensebox_rg15_rainsensor",
  ],
];

// Loop: print every sensor value on the display.
function allSensorsXml() {
  const sensorBlocks = SENSOR_VALUES.flatMap(([type, field, values]) =>
    values.map((value) => {
      const fields = field ? `<field name="${field}">${value}</field>` : "";
      const time =
        value === "longPress" ? '<field name="time">1000</field>' : "";
      return `<block type="${type}">${fields}${time}</block>`;
    }),
  );
  const prints = sensorBlocks.reduceRight(
    (next, sensor) => `
      <block type="sensebox_display_printDisplay">
        <field name="COLOR">WHITE,BLACK</field>
        <field name="SIZE">1</field>
        <field name="X">0</field>
        <field name="Y">0</field>
        <value name="printDisplay">${sensor}</value>
        ${next ? `<next>${next}</next>` : ""}
      </block>`,
    "",
  );
  return `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_functions" deletable="false" id="start" x="27" y="16">
    <statement name="SETUP_FUNC">
      <block type="sensebox_display_beginDisplay"></block>
    </statement>
    <statement name="LOOP_FUNC">
      <block type="sensebox_display_show">
        <statement name="SHOW">${prints}</statement>
      </block>
    </statement>
  </block>
</xml>`;
}

function visitEditor(board, xml, locale = "de_DE") {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.sessionStorage.setItem("board", board);
      win.localStorage.setItem("locale", locale);
      win.localStorage.setItem("autoSaveXML", xml);
    },
  });
}

describe("Simulator", () => {
  it("shows the board and the sensors used by the program", () => {
    visitEditor("MCU-S2", displayTemperatureXml());

    cy.get("#codeviewer-simulator", { timeout: 20000 }).should("be.visible");
    cy.get(".react-flow__node-board").should("exist");
    cy.get(".react-flow__node-senseBox_hdc1080").should("exist");
    cy.get(".react-flow__node-senseBox_display").should("exist");
    cy.get("#simulator-hint").should("not.exist");
  });

  it("runs the program and draws the sensor value on the display", () => {
    visitEditor("MCU-S2", displayTemperatureXml());

    cy.get(".react-flow__node-senseBox_hdc1080", { timeout: 20000 }).should(
      "exist",
    );
    cy.get("#codeviewer-simulator svg.fa-play").parents("button").click();
    cy.get("#codeviewer-simulator svg.fa-stop", { timeout: 10000 }).should(
      "exist",
    );

    // Some pixels of the OLED canvas turn white once the text is drawn.
    cy.get("#oled-display", { timeout: 10000 }).should(($canvas) => {
      const canvas = $canvas[0];
      const { data } = canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height);
      let whitePixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
          whitePixels++;
        }
      }
      expect(whitePixels).to.be.greaterThan(0);
    });

    cy.get("#codeviewer-simulator svg.fa-stop").parents("button").click();
    cy.get("#codeviewer-simulator svg.fa-play").should("exist");
  });

  it("runs every simulated sensor value without errors", () => {
    visitEditor("MCU-S2", allSensorsXml());

    SENSOR_VALUES.forEach(([, , , node]) => {
      if (node) {
        cy.get(`.react-flow__node-${node}`, { timeout: 20000 }).should("exist");
      }
    });
    cy.get("#simulator-hint").should("not.exist");

    cy.get("#codeviewer-simulator svg.fa-play").parents("button").click();
    // A missing interpreter function would stop the simulation right away.
    cy.wait(3000);
    cy.get("#codeviewer-simulator").then(($simulator) => {
      expect($simulator.find("#simulator-error").text(), "error").to.equal("");
    });
    cy.get("#codeviewer-simulator svg.fa-stop").should("exist");
    cy.get("#codeviewer-simulator svg.fa-stop").parents("button").click();
  });

  it("runs user functions", () => {
    visitEditor(
      "MCU-S2",
      `<xml xmlns="https://developers.google.com/blockly/xml">
        <block type="arduino_functions" deletable="false" id="start" x="27" y="16">
          <statement name="SETUP_FUNC">
            <block type="sensebox_display_beginDisplay"></block>
          </statement>
          <statement name="LOOP_FUNC">
            <block type="sensebox_display_show">
              <statement name="SHOW">
                <block type="procedures_callnoreturn">
                  <mutation name="showTemperature"></mutation>
                </block>
              </statement>
            </block>
          </statement>
        </block>
        <block type="procedures_defnoreturn" x="400" y="16">
          <field name="NAME">showTemperature</field>
          <statement name="STACK">
            <block type="sensebox_display_printDisplay">
              <field name="COLOR">WHITE,BLACK</field>
              <field name="SIZE">2</field>
              <field name="X">0</field>
              <field name="Y">0</field>
              <value name="printDisplay">
                <block type="sensebox_sensor_temp_hum">
                  <field name="NAME">Temperature</field>
                </block>
              </value>
            </block>
          </statement>
        </block>
      </xml>`,
    );

    // The sensor inside the function is found
    cy.get(".react-flow__node-senseBox_hdc1080", { timeout: 20000 }).should(
      "exist",
    );
    cy.get("#codeviewer-simulator svg.fa-play").parents("button").click();
    cy.get("#oled-display", { timeout: 10000 }).should(($canvas) => {
      const canvas = $canvas[0];
      const { data } = canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height);
      expect(data.some((value, i) => i % 4 === 0 && value > 200)).to.equal(
        true,
      );
    });
    cy.get("#codeviewer-simulator").then(($simulator) => {
      expect($simulator.find("#simulator-error").text(), "error").to.equal("");
    });
    cy.get("#codeviewer-simulator svg.fa-stop").parents("button").click();
  });

  it("lights the RGB LED of the board and turns it off on stop", () => {
    visitEditor(
      "MCU-S2",
      `<xml xmlns="https://developers.google.com/blockly/xml">
        <block type="arduino_functions" deletable="false" id="start" x="27" y="16">
          <statement name="LOOP_FUNC">
            <block type="sensebox_ws2818_led">
              <value name="COLOR">
                <block type="colour_picker">
                  <field name="COLOUR">#ff0000</field>
                </block>
              </value>
            </block>
          </statement>
        </block>
      </xml>`,
    );

    cy.get(".react-flow__node-board", { timeout: 20000 }).should("exist");
    cy.get("#codeviewer-simulator svg.fa-play").parents("button").click();
    cy.get("#board-complex_svg__circle270").should(($led) => {
      expect($led[0].style.fill).to.equal("rgb(255, 0, 0)");
    });
    cy.get("#codeviewer-simulator svg.fa-stop").parents("button").click();
    cy.get("#board-complex_svg__circle270").should(($led) => {
      expect($led[0].style.fill).to.equal("");
    });
  });

  it("lights the LEDs of the QOOOL fluoro bee", () => {
    visitEditor(
      "MCU-S2",
      `<xml xmlns="https://developers.google.com/blockly/xml">
        <block type="arduino_functions" deletable="false" id="start" x="27" y="16">
          <statement name="SETUP_FUNC">
            <block type="sensebox_fluoroASM_init">
              <field name="FILTER_ACTIVE">TRUE</field>
              <field name="FILTER_TARGET">LED2</field>
            </block>
          </statement>
          <statement name="LOOP_FUNC">
            <block type="sensebox_fluoroASM_setLED">
              <field name="LED_NUMBER">1</field>
              <field name="STAT">HIGH</field>
            </block>
          </statement>
        </block>
      </xml>`,
    );

    cy.get(".react-flow__node-sensebox_fluoroASM_init", {
      timeout: 20000,
    }).should("exist");
    // The filter is active, so it can be moved between the LEDs.
    cy.get(".react-flow__node-sensebox_fluoroASM_init svg.fa-arrow-up").should(
      "exist",
    );

    cy.get("#codeviewer-simulator svg.fa-play").parents("button").click();
    cy.get("#fluoro_led1").should(($led) => {
      expect($led[0].style.fill).to.equal("rgb(255, 51, 51)");
    });

    cy.get("#codeviewer-simulator svg.fa-stop").parents("button").click();
    cy.get("#fluoro_led1").should(($led) => {
      expect($led[0].style.fill).to.equal("black");
    });
  });

  it("skips blocks the simulator does not support and lists them", () => {
    visitEditor("MCU-S2", displayTemperatureXml(wifiBlock));

    cy.get("#simulator-hint", { timeout: 20000 })
      .should("be.visible")
      .and("contain", "unterstützt der Simulator nicht");
    // The rest of the program is still simulated.
    cy.get(".react-flow__node-senseBox_hdc1080").should("exist");
  });

  it("records sensor values in the graph and events in the debug log", () => {
    visitEditor("MCU-S2", displayTemperatureXml());

    cy.get(".react-flow__node-senseBox_hdc1080", { timeout: 20000 }).should(
      "exist",
    );
    cy.get("#codeviewer-simulator svg.fa-play").parents("button").click();

    // Graph of the HDC1080 temperature
    cy.get("#tooltip-tab-graph").click();
    cy.contains("Temperatur (°C) – HDC1080", { timeout: 10000 }).should(
      "be.visible",
    );
    cy.get(".helpSection .MuiChartsSurface-root").should("exist");

    // The graph keeps its history when switching tabs
    cy.get("#tooltip-tab-help").click();
    cy.get("#tooltip-tab-graph").click();
    cy.get(".helpSection .MuiChartsSurface-root").should("exist");

    cy.get("#codeviewer-simulator svg.fa-stop").parents("button").click();

    cy.get("#tooltip-tab-debug").click();
    cy.contains("Simulation gestartet").should("be.visible");
    cy.contains("Simulation gestoppt").should("be.visible");
  });

  it("shows its texts in English", () => {
    visitEditor("MCU-S2", displayTemperatureXml(wifiBlock), "en_US");

    cy.get("#simulator-hint", { timeout: 20000 }).should(
      "contain",
      "does not support these blocks",
    );
    cy.get("#tooltip-tab-help").should("contain", "Help");
    // Slider label of the HDC1080
    cy.get(".react-flow__node-senseBox_hdc1080").should(
      "contain",
      "Temperature (°C)",
    );
  });

  it("is not offered for other boards", () => {
    visitEditor("MCU", displayTemperatureXml());

    cy.get("#codeviewer-headline", { timeout: 20000 }).should("be.visible");
    cy.get("#codeviewer-simulator").should("not.exist");
    cy.get("#tooltip-tab-graph").should("not.exist");
  });
});

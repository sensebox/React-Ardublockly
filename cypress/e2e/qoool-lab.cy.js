/// <reference types="cypress" />
describe("QOOOL Lab", () => {
  const source = (name) => cy.get("#qoool-source").contains("button", name);
  function visit(board = "MCU-S2", serial = true) {
    const sent = [];
    cy.visit("/qoool", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("board", board);
        win.localStorage.setItem("locale", "en_US");
        if (!serial) {
          Object.defineProperty(win.navigator, "serial", {
            value: undefined,
            configurable: true,
          });
          return;
        }
        let input;
        const reply = (text) =>
          input.enqueue(new win.TextEncoder().encode(text));
        const port = {
          open: async () => {},
          close: async () => {},
          readable: new win.ReadableStream({
            start(controller) {
              input = controller;
            },
          }),
          writable: new win.WritableStream({
            write(bytes) {
              const command = new win.TextDecoder().decode(bytes);
              sent.push(command);
              if (command === "<ping>") {
                reply("<po");
                reply("ng>");
              }
              if (command === "<start,sweep>") {
                reply(
                  "<start,sweep><batch,[[2700,100,2700,50,2700,25,2700,10],[2840,95,2840,48,2840,24,2840,9],[3000,100,3000,50,3000,25,3000,10]]><end>",
                );
              }
              if (command === "<start,waterfall>")
                reply(
                  "<start,sweep><batch,[[2700,100,2700,50,2700,25,2700,10],[3000,95,3000,48,3000,24,3000,9]]><end>",
                );
              if (command === "<end>") reply("<end>");
            },
          }),
        };
        Object.defineProperty(win.navigator, "serial", {
          value: { requestPort: async () => port },
          configurable: true,
        });
      },
    });
    return sent;
  }
  it("keeps the real device for the MCU-S2 but offers the simulator on other boards", () => {
    visit("MCU");
    // The lab sits in one card with the source toggle; the simulator is
    // preselected and already running.
    source("Simulator").should("have.attr", "aria-pressed", "true");
    cy.contains("Simulator running").should("be.visible");
    source("MCU-S2").click();
    source("MCU-S2").should("have.attr", "aria-pressed", "true");
    cy.contains("requires the MCU-S2").should("be.visible");
    cy.contains("button", "Connect MCU-S2").should("be.disabled");
    source("Simulator")
      .should("be.enabled")
      .and("have.attr", "aria-pressed", "false");
    cy.get('canvas[aria-label="sweep measurement plot"]').should("be.visible");
  });
  it("simulates the magnetometer without Web Serial and follows the magnet", () => {
    visit("MCU", false);
    // The simulator starts by itself, magnet far away: no field, B = 0.
    cy.contains("Simulator running").should("be.visible");
    source("Simulator").should("have.attr", "aria-pressed", "true");
    cy.get("#magnetometer-field-calculation")
      .should("be.visible")
      .and("contain", "Only one dip")
      .find("[data-field]")
      .should("have.attr", "data-field", "0.00");
    cy.get("#magnetometer-magnet").should("have.attr", "aria-valuenow", "100");
    // Sweep, Waterfall and both together are offered.
    cy.get('[role="tab"]').should("have.length", 3);
    cy.contains('[role="tab"]', /Hopp|Roll|X–Y/).should("not.exist");
    cy.contains("label", "Start (GHz)").should("be.visible");
    // The settings sit in a bar on the plot.
    cy.get("#qoool-parameters")
      .contains("label", "Start (GHz)")
      .should("be.visible");
    // The NV centres are chosen in the magnet scene, not at the plot.
    cy.get("#qoool-parameters #magnetometer-orientations-1").should(
      "not.exist",
    );
    cy.get("#magnetometer-simulator").within(() => {
      cy.get("#magnetometer-scene").should("be.visible");
      cy.get("#magnetometer-fieldlines-switch").should("exist");
      // The simulator starts in the 2D top view.
      cy.get("#magnetometer-3d-switch").should("not.be.checked");
      cy.get("#magnetometer-scene svg").should("have.attr", "data-view", "2d");
      cy.get('[role="tab"]').should("not.exist");
      cy.get("#magnetometer-orientations-1").should("exist");
    });
    // On a laptop screen the whole page fits on one screen without scrolling:
    // the footer ends at the bottom of the window.
    cy.viewport(1440, 900);
    cy.scrollTo(0, 0);
    cy.get("footer").should(([footer]) => {
      const bottom = footer.getBoundingClientRect().bottom;
      const height = footer.ownerDocument.defaultView.innerHeight;
      expect(bottom).to.be.at.most(height + 1);
      expect(bottom).to.be.at.least(height - 40);
    });
    // The help bar under the scene shows keys and gestures; in 2D without the
    // view controls. It can be closed and brought back with the info button.
    cy.get("#magnetometer-help").should("be.visible");
    cy.get("#magnetometer-help kbd").should("contain", "⇧");
    cy.get('#magnetometer-help [data-help="turn"]').should("be.visible");
    cy.get('#magnetometer-help [data-help="orbit"]').should("not.exist");
    cy.get("#magnetometer-help-close").click();
    cy.get("#magnetometer-help").should("not.exist");
    cy.get("#magnetometer-hint").click();
    cy.get("#magnetometer-help").should("be.visible");
    // No channel checkboxes; the simulator only has one channel.
    cy.contains("label", "CH 1").should("not.exist");

    // Without a plot to read from, the worked example highlights nothing.
    cy.get("#magnetometer-readout-legend").should("not.exist");
    // One big start button at the top of the lab; it turns into Stop.
    cy.get("#qoool-run").should("contain", "Start Sweep");
    // Magnet far away: both resonances overlap at 2870 MHz.
    cy.contains("button", /^Start Sweep$/).click();
    cy.get("#qoool-run").should("contain", "Stop");
    cy.get('[role="status"]').should("contain", "Sweep");
    // Wait for the first simulated sweep before stopping.
    cy.get('[aria-label="Serial log"]').should("contain", "RX: <start,sweep>");
    cy.contains("button", /^Stop$/).click();
    cy.get('[role="status"]').should("not.exist");
    // The simulator offers no data download; that is for real measurements.
    cy.contains("button", "Download data").should("not.exist");
    cy.get("#magnetometer-field-calculation")
      .should("contain", "Only one dip")
      .find("[data-field]")
      .should("have.attr", "data-field", "0.00");
    cy.contains("Lorentzian fit").should("not.exist");

    // Magnet halfway to the sensor: the lower resonance moves to 2835 MHz.
    cy.contains("button", /^Start Sweep$/).click();
    cy.get('[role="status"]').should("contain", "Sweep");
    cy.get("#magnetometer-magnet").focus();
    cy.get("#magnetometer-magnet").type("{leftarrow}".repeat(10));
    cy.get("#magnetometer-magnet").should("have.attr", "aria-valuenow", "50");
    // Let the next simulated sweep and plot refresh arrive.
    cy.wait(500);
    cy.contains("button", /^Stop$/).click();
    cy.get('[role="status"]').should("not.exist");
    // Halfway: f₂ − f₁ = 70 MHz, B = 0.070 GHz / 56 GHz/T = 1.25 mT.
    cy.get("#magnetometer-field-calculation [data-field]")
      .should("have.attr", "data-low", "2.835")
      .and("have.attr", "data-high", "2.905")
      .and("have.attr", "data-field", "1.25");
    cy.get("#magnetometer-field-calculation math").should(
      "have.length.above",
      4,
    );
    // With the dips in the plot, the values read from it are highlighted in
    // senseBox green, with a legend explaining it.
    cy.get("#magnetometer-field-calculation [data-field]").should(
      "have.attr",
      "data-highlight",
      "on",
    );
    cy.get("#magnetometer-readout-legend").should(
      "contain",
      "can be read from the plot",
    );
    cy.get("#magnetometer-field-calculation").should("contain", "Δ");

    // Ensemble, magnet direction and field lines can change while a sweep runs.
    cy.contains("button", /^Start Sweep$/).click();
    cy.get('[role="status"]').should("contain", "Sweep");
    // Only a single NV or all four orientations are offered.
    cy.get("#magnetometer-orientations-1").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    cy.get("#magnetometer-orientations-2").should("not.exist");
    cy.get("#magnetometer-scene [data-diamond]").should("have.length", 1);
    cy.get("#magnetometer-orientations-4").click();
    cy.get("#magnetometer-orientations-4").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    cy.contains("ensemble with 4 NV orientations").should("be.visible");
    // Clicking the sensor opens a menu with the same choice.
    cy.get("#magnetometer-sensor").click({ force: true });
    cy.get("#magnetometer-sensor-orientations-4").should(
      "have.class",
      "Mui-selected",
    );
    cy.get("#magnetometer-sensor-orientations-1").click();
    cy.get("#magnetometer-sensor-menu").should("not.exist");
    cy.get("#magnetometer-scene [data-diamond]").should("have.length", 1);
    cy.get("#magnetometer-orientations-1").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    cy.get("#magnetometer-sensor").focus().type("{enter}");
    cy.get("#magnetometer-sensor-orientations-4").click();
    cy.get("#magnetometer-orientations-4").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    // One diamond per NV centre in the 3D scene.
    cy.get("#magnetometer-3d-switch").check();
    cy.get("#magnetometer-scene svg").should("have.attr", "data-view", "3d");
    cy.get('#magnetometer-help [data-help="zoom"]').should("be.visible");
    cy.get("#magnetometer-scene [data-diamond]").should("have.length", 4);
    // They sit at the corners of a tetrahedron: six edges.
    cy.get("#magnetometer-tetrahedron > path").should("have.length", 6);
    // Shift + arrows move the magnet around the sensor in 5° steps: from above
    // the field is across NV axis 1.
    cy.get("#magnetometer-magnet").should("have.attr", "data-angle", "0");
    cy.get("#magnetometer-magnet").focus();
    cy.get("#magnetometer-magnet").type("{shift}" + "{uparrow}".repeat(18));
    cy.get("#magnetometer-magnet").should("have.attr", "data-angle", "90");
    cy.get("#magnetometer-magnet").should("have.attr", "aria-valuenow", "50");
    cy.get("#magnetometer-scene").should("contain", "90°");
    cy.get("#magnetometer-magnet").type("{shift}" + "{downarrow}".repeat(18));
    cy.get("#magnetometer-magnet").should("have.attr", "data-angle", "0");
    // Dragging the background turns the view, the magnet stays put.
    cy.get("#magnetometer-scene svg")
      .trigger("pointerdown", 40, 40, { pointerId: 1 })
      .trigger("pointermove", 140, 80, { pointerId: 1 })
      .trigger("pointerup", 140, 80, { pointerId: 1 });
    cy.get("#magnetometer-magnet").should("have.attr", "data-angle", "0");
    // Zoom with the buttons, the mouse wheel and the keyboard; reset restores it.
    cy.get("#magnetometer-scene svg").should("have.attr", "data-zoom", "1.60");
    cy.get("#magnetometer-zoom-in").click();
    cy.get("#magnetometer-scene svg").should("have.attr", "data-zoom", "2.00");
    cy.get("#magnetometer-scene svg").trigger("wheel", { deltaY: 200 });
    cy.get("#magnetometer-scene svg")
      .invoke("attr", "data-zoom")
      .then(Number)
      .should("be.lessThan", 2);
    cy.get("#magnetometer-magnet").focus();
    cy.get("#magnetometer-magnet").type("-");
    cy.get("#magnetometer-reset-view").click();
    cy.get("#magnetometer-scene svg").should("have.attr", "data-zoom", "1.60");
    cy.get("#magnetometer-magnet").should("have.attr", "aria-valuenow", "50");
    // The 2D view is a fixed top view: a magnet above the sensor moves onto
    // the table, Shift + arrows turn it there, and the view itself stays put.
    cy.get("#magnetometer-3d-switch").should("be.checked");
    cy.get("#magnetometer-magnet").focus();
    cy.get("#magnetometer-magnet").type("{shift}" + "{uparrow}".repeat(18));
    cy.get("#magnetometer-magnet").should("have.attr", "data-angle", "90");
    cy.get("#magnetometer-3d-switch").uncheck();
    cy.get("#magnetometer-scene svg").should("have.attr", "data-view", "2d");
    cy.get("#magnetometer-magnet")
      .should("have.attr", "data-angle", "0")
      .and("have.attr", "data-direction", "1.00,0.00,0.00");
    cy.get("#magnetometer-zoom-in").should("not.exist");
    // While the magnet is dragged, a tip at the pointer shows the angle.
    cy.get("#magnetometer-angle-tip").should("not.exist");
    cy.get("#magnetometer-magnet")
      .trigger("pointerdown", { button: 0, pointerId: 1 })
      .trigger("pointermove", { pointerId: 1 });
    cy.get("#magnetometer-angle-tip").should("contain", "°");
    cy.get("#magnetometer-scene svg").trigger("pointerup", { pointerId: 1 });
    cy.get("#magnetometer-angle-tip").should("not.exist");
    cy.get("#magnetometer-reset-view").should("not.exist");
    cy.get("#magnetometer-scene svg").trigger("wheel", { deltaY: -400 });
    cy.get("#magnetometer-scene svg").should("have.attr", "data-zoom", "1.00");
    // The sensor sits at the left edge; far away, the magnet reaches the right.
    cy.get("#magnetometer-magnet").focus();
    cy.get("#magnetometer-magnet").type("{end}");
    cy.get("#magnetometer-scene svg").then(([scene]) => {
      const box = scene.getBoundingClientRect();
      const sensor = scene
        .querySelector("[data-diamond]")
        .getBoundingClientRect();
      const magnet = scene
        .querySelector("#magnetometer-magnet polygon")
        .closest("g#magnetometer-magnet")
        .getBoundingClientRect();
      expect(sensor.left - box.left).to.be.lessThan(0.25 * box.width);
      expect(magnet.right - box.left).to.be.greaterThan(0.8 * box.width);
    });
    // Up/Down without Shift slide the magnet up or down on screen: x stays.
    cy.get("#magnetometer-magnet").type("{home}");
    cy.get("#magnetometer-magnet").type("{uparrow}".repeat(4));
    cy.get("#magnetometer-magnet")
      .invoke("attr", "data-direction")
      .should("match", /^[0-9.]+,0\.00,-[0-9.]+$/);
    cy.get("#magnetometer-magnet").type("{downarrow}".repeat(4));
    cy.get("#magnetometer-magnet").should("have.attr", "data-angle", "0");
    // Near the sensor it can go straight beside it (90°).
    cy.get("#magnetometer-magnet").type("{home}");
    cy.get("#magnetometer-magnet").type("{shift}" + "{downarrow}".repeat(18));
    cy.get("#magnetometer-magnet")
      .should("have.attr", "data-angle", "90")
      .and("have.attr", "data-direction", "0.00,0.00,1.00");
    cy.get("#magnetometer-magnet").type("{shift}" + "{uparrow}".repeat(18));
    cy.get("#magnetometer-magnet").should("have.attr", "data-angle", "0");
    // The y arrow moves the magnet straight up on screen: x stays, the tip
    // names the axis. The 2D view has only x and y arrows.
    cy.get("#magnetometer-axis-z").should("not.exist");
    cy.get("#magnetometer-axis-y")
      .trigger("pointerdown", { button: 0, pointerId: 1 })
      .trigger("pointermove", "top", { pointerId: 1 });
    cy.get("#magnetometer-angle-tip").should("contain", "y ·");
    cy.get("#magnetometer-scene svg").trigger("pointerup", { pointerId: 1 });
    cy.get("#magnetometer-magnet")
      .invoke("attr", "data-angle")
      .then(Number)
      .should("be.greaterThan", 10);
    cy.get("#magnetometer-magnet")
      .invoke("attr", "data-direction")
      .should("match", /^[0-9.]+,0\.00,-[0-9.]+$/);
    // The knob where the arrows cross moves the magnet freely: both x and y
    // change, and the tip names no axis.
    cy.get("#magnetometer-magnet")
      .invoke("attr", "data-direction")
      .then((before) => {
        cy.get("#magnetometer-free-handle")
          .trigger("pointerdown", { button: 0, pointerId: 1 })
          .trigger("pointermove", 40, -30, { pointerId: 1, force: true });
        cy.get("#magnetometer-angle-tip")
          .should("contain", "°")
          .and("not.contain", "·");
        cy.get("#magnetometer-scene svg").trigger("pointerup", {
          pointerId: 1,
        });
        cy.get("#magnetometer-magnet").should((magnet) => {
          const [x0, , z0] = before.split(",").map(Number);
          const [x1, , z1] = magnet
            .attr("data-direction")
            .split(",")
            .map(Number);
          expect(x1).not.to.equal(x0);
          expect(z1).not.to.equal(z0);
        });
      });
    cy.get("#magnetometer-3d-switch").check();
    cy.get("#magnetometer-scene svg").should("have.attr", "data-view", "3d");
    // Back in 3D the default, zoomed-in view is shown.
    cy.get("#magnetometer-scene svg").should("have.attr", "data-zoom", "1.60");
    // Field lines are off by default and can be switched on.
    cy.get("#magnetometer-fieldlines").should("not.exist");
    cy.get("#magnetometer-fieldlines-switch").check();
    cy.get("#magnetometer-fieldlines > path").should("have.length.above", 4);
    cy.get("#magnetometer-fieldlines-switch").uncheck();
    cy.get("#magnetometer-fieldlines").should("not.exist");
    cy.wait(500);
    cy.get('[role="status"]').should("contain", "Sweep");
    cy.get(".MuiAlert-standardError").should("not.exist");
    cy.contains("button", /^Stop$/).click();
    cy.get('[role="status"]').should("not.exist");

    // The waterfall collects one row per simulated sweep. Switching tabs while
    // measuring carries on in the other mode without a restart.
    cy.contains("button", /^Start Sweep$/).click();
    cy.get('[role="status"]').should("contain", "Sweep");
    cy.contains('[role="tab"]', /^Waterfall$/).click();
    cy.get('[role="status"]').should("contain", "Waterfall");
    cy.get('[aria-label="Serial log"]').should("contain", "<start,waterfall>");
    cy.wait(500);
    cy.get('[role="status"]').should("contain", "Waterfall");
    // The third tab shows the newest sweep and the waterfall at once; it keeps
    // the running waterfall measurement.
    cy.contains('[role="tab"]', /^Sweep \+ Waterfall$/).click();
    cy.get('[role="status"]').should("contain", "Sweep + Waterfall");
    cy.get('canvas[aria-label="sweep measurement plot"]').should("be.visible");
    cy.get('canvas[aria-label="waterfall measurement plot"]').should(
      "be.visible",
    );
    // Side by side as tiles on a wide screen.
    cy.get('#qoool-both [data-tile="sweep"]').then(([sweep]) => {
      cy.get('#qoool-both [data-tile="waterfall"]').then(([waterfall]) => {
        const a = sweep.getBoundingClientRect(),
          b = waterfall.getBoundingClientRect();
        expect(Math.abs(a.top - b.top)).to.be.lessThan(2);
        expect(b.left).to.be.greaterThan(a.right - 1);
      });
    });
    // Pausing reads the dips off the frozen curve: the worked example stays
    // with the plot while the magnet moves on.
    cy.wait(500);
    cy.get("#qoool-plot-pause").click();
    cy.get("#magnetometer-field-calculation [data-field]")
      .first()
      .invoke("attr", "data-low")
      .then((low) => {
        cy.get("#magnetometer-magnet").focus();
        cy.get("#magnetometer-magnet").type("{leftarrow}".repeat(4));
        cy.wait(500);
        cy.get("#magnetometer-field-calculation [data-field]")
          .first()
          .should("have.attr", "data-low", low);
      });
    cy.get("#qoool-plot-pause").click();
    cy.wait(500);
    cy.get(".MuiAlert-standardError").should("not.exist");
    cy.contains('[role="tab"]', /^Sweep$/).click();
    cy.get('[role="status"]').should("contain", "Sweep");
    cy.wait(500);
    cy.get('[role="status"]').should("contain", "Sweep");
    cy.get(".MuiAlert-standardError").should("not.exist");
    cy.contains("button", /^Stop$/).click();
    cy.get('[role="status"]').should("not.exist");

    // The device buttons only belong to the MCU-S2 source.
    cy.contains("button", "Disconnect").should("not.exist");
    source("MCU-S2").click();
    cy.get("#magnetometer-scene").should("not.exist");
    cy.contains("Disconnected").should("be.visible");
    cy.contains("button", "Disconnect").should("be.disabled");
    source("Simulator").should("have.attr", "aria-pressed", "false");
  });
  it("pauses the plot and downloads it as PNG", () => {
    visit("MCU", false);
    const plot = () => cy.get('canvas[aria-label="sweep measurement plot"]');
    cy.get("#qoool-plot-pause").should("be.disabled");
    cy.get("#qoool-plot-png").should("be.disabled");
    cy.contains("Simulator running").should("be.visible");
    cy.contains("button", /^Start Sweep$/).click();
    cy.get('[aria-label="Serial log"]').should("contain", "RX: <start,sweep>");
    cy.get("#qoool-plot-pause").click();
    cy.get("#qoool-plot-pause").should("have.attr", "aria-pressed", "true");
    plot().then(([canvas]) => {
      const before = canvas.toDataURL();
      // The measurement goes on, but the paused plot keeps its picture.
      cy.get("#magnetometer-magnet").focus();
      cy.get("#magnetometer-magnet").type("{leftarrow}".repeat(10));
      cy.get("#magnetometer-magnet").should("have.attr", "aria-valuenow", "50");
      // Let the next simulated sweeps arrive.
      cy.wait(500);
      plot().should(([after]) => expect(after.toDataURL()).to.equal(before));
    });
    cy.window().then((win) => cy.spy(win.URL, "createObjectURL").as("blob"));
    cy.get("#qoool-plot-png").click();
    cy.get("@blob").should((spy) => {
      expect(spy).to.have.been.called;
      expect(spy.lastCall.args[0].type).to.equal("image/png");
    });
    cy.get("#qoool-plot-pause").click();
    cy.get("#qoool-plot-pause").should("have.attr", "aria-pressed", "false");
  });
  it("explains unavailable Web Serial", () => {
    visit("MCU-S2", false);
    source("MCU-S2").click();
    cy.contains(/USB serial requires|USB-Serial benötigt/).should("be.visible");
    cy.contains("button", /Connect MCU-S2|MCU-S2 verbinden/).should(
      "be.disabled",
    );
  });
  it("connects, captures a sweep and handles waterfall stop", () => {
    const sent = visit();
    source("MCU-S2").click();
    // Frequencies read in GHz for the real device too; commands stay in MHz.
    cy.contains("label", "f1 (GHz)").should("be.visible");
    cy.contains("button", /Connect MCU-S2|MCU-S2 verbinden/).click();
    cy.contains("button", /^Start Sweep$/)
      .should("be.enabled")
      .click();
    cy.contains("button", /Download data|Daten herunterladen/).should(
      "be.enabled",
    );
    cy.get('[aria-label="Serial log"]').should("contain", "<end>");
    cy.contains('[role="tab"]', "Waterfall").click();
    cy.contains("button", /^Start Waterfall$/).click();
    cy.get('[role="status"]').should("contain", "Waterfall");
    cy.get('[aria-label="Serial log"]').should(
      "contain",
      "TX: <start,waterfall>",
    );
    cy.contains("button", /Stop/).click();
    cy.get('[role="status"]').should("not.exist");
    cy.contains("button", /Disconnect|Trennen/).click();
    cy.contains("button", /Connect MCU-S2|MCU-S2 verbinden/).should(
      "be.enabled",
    );
    cy.then(() => {
      expect(sent).to.include("<start,sweep>");
      expect(sent).to.include("<start,waterfall>");
      expect(sent).to.include("<end>");
    });
  });
  it("switches from a connected MCU-S2 to the simulator", () => {
    const sent = visit();
    source("MCU-S2").click();
    cy.contains("button", "Connect MCU-S2").click();
    cy.contains("Connected").should("be.visible");
    cy.then(() => expect(sent).not.to.include("<end>"));
    source("Simulator").click();
    cy.contains("Simulator running").should("be.visible");
    cy.get("#magnetometer-scene").should("be.visible");
    // The real port was closed properly before the simulator took over.
    cy.then(() => expect(sent).to.include("<end>"));
    cy.contains("button", "Connect MCU-S2").should("not.exist");
  });
});

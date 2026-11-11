/// <reference types="cypress" />
describe("QOOOL Lab", () => {
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
  it("guards direct access for other boards", () => {
    visit("MCU");
    cy.contains("available for senseBox MCU-S2 only").should("be.visible");
    cy.get('canvas[aria-label="sweep measurement plot"]').should("not.exist");
  });
  it("explains unavailable Web Serial", () => {
    visit("MCU-S2", false);
    cy.contains(/USB serial requires|USB-Serial benötigt/).should("be.visible");
    cy.contains("button", /Connect MCU-S2|MCU-S2 verbinden/).should(
      "be.disabled",
    );
  });
  it("connects, captures a sweep, enables fitting and handles waterfall stop", () => {
    const sent = visit();
    cy.contains("button", /Connect MCU-S2|MCU-S2 verbinden/).click();
    cy.contains("button", /Start.*SWEEP/)
      .should("be.enabled")
      .click();
    cy.contains("button", /Automatic fit|Automatisch fitten/).should(
      "be.enabled",
    );
    cy.contains("button", /Download data|Daten herunterladen/).should(
      "be.enabled",
    );
    cy.get('[aria-label="Serial log"]').should("contain", "<end>");
    cy.contains('[role="tab"]', "Waterfall").click();
    cy.contains("button", /Start.*WATERFALL/).click();
    cy.get('[role="status"]').should("contain", "WATERFALL");
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
});

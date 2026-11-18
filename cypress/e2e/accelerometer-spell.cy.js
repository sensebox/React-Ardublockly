/// <reference types="cypress" />

// The accelerometer block offers a "spell" option
// (image output) on the MCU-Eye only.
describe("Accelerometer spell option", () => {
  // Blockly renders spaces in field texts as non-breaking spaces
  const spellLabel = /Zauberspruch/;

  const loadProject = (board) => {
    cy.visit("/");
    cy.get('img[alt="Sensebox ESP32S3"]', { timeout: 8000 }).click();
    cy.fixture("eye-accelerometer-spell.xml").then((xml) => {
      cy.get("#open-blocks").selectFile(
        {
          contents: Cypress.Buffer.from(
            xml.replace('board="MCU-EYE"', `board="${board}"`),
          ),
          fileName: "spell.xml",
          mimeType: "text/xml",
        },
        { force: true },
      );
    });
    cy.get("button").contains("Bestätigen").click();
    cy.get(".blocklyMainBackground", { timeout: 8000 }).should("exist");
    cy.get(".blocklyText")
      .contains(/Zeichne\s+Bild/)
      .should("exist");
  };

  it("[Blockly] loads the spell option on the MCU-Eye", () => {
    loadProject("MCU-EYE");
    cy.get(".blocklyText").contains(spellLabel).should("exist");
  });

  it("[Blockly] does not offer the spell option on the MCU-S2", () => {
    loadProject("MCU-S2");
    cy.get(".blocklyText").contains(spellLabel).should("not.exist");
  });
});

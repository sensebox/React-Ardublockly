/// <reference types="cypress" />

// Uploading a model shows the matching classification block:
// 32x32 models -> spell block, 96x96 models -> camera block.
describe("AI classification blocks", () => {
  // Minimal model settings, enough for detecting the model type and labels
  const modelCpp = (size) =>
    `constexpr int kNumCols = ${size};\n` +
    `constexpr int kNumRows = ${size};\n` +
    "constexpr int kCategoryCount = 2;\n" +
    'const char* kCategoryLabels[kCategoryCount] = {"kreis","dreieck",};\n';

  const uploadModel = (size) => {
    cy.visit("/");
    cy.window().then((win) => win.localStorage.removeItem("aiModelCode"));
    cy.get('img[alt="Sensebox ESP32S3"]', { timeout: 8000 }).click();
    cy.get(".blocklyMainBackground", { timeout: 8000 }).should("exist");
    cy.get('input[type="file"][accept=".cpp"]').selectFile(
      {
        contents: Cypress.Buffer.from(modelCpp(size)),
        fileName: "model.cpp",
      },
      { force: true },
    );
  };

  it("[Blockly] shows the spell block for a spell model", () => {
    uploadModel(32);
    cy.get(".blocklyFlyout .blocklyText").contains("kreis").should("exist");
    // tag of the classification block (icon with alt text)
    cy.get('.blocklyFlyout image[alt="Zauberspruch"]').should("exist");
    // spell option of the accelerometer block that is already plugged in
    cy.get(".blocklyFlyout .blocklyText")
      .filter((i, el) => /^\s*Zauberspruch[\s▾]*$/.test(el.textContent))
      .should("have.length", 1);
    cy.get('.blocklyFlyout image[alt="Kamera"]').should("not.exist");
  });

  it("[Blockly] shows the camera block for a camera model", () => {
    uploadModel(96);
    // tag of the classification block (icon with alt text)
    cy.get('.blocklyFlyout image[alt="Kamera"]').should("exist");
    cy.get(".blocklyFlyout .blocklyText").contains("kreis").should("exist");
    cy.get('.blocklyFlyout image[alt="Zauberspruch"]').should("not.exist");
    cy.get(".blocklyFlyout .blocklyText")
      .contains(/Zauberspruch/)
      .should("not.exist");
  });
});

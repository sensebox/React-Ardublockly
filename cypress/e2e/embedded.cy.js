/// <reference types="cypress" />

describe("Embedded Blockly Page Tests", () => {
  it("[Embedded] visits the embedded page", () => {
    cy.visit("/embedded");
    cy.url().should("include", "/embedded");
  });

  it("[Embedded] displays Blockly workspace", () => {
    cy.visit("/embedded");
    cy.get(".blocklySvg", { timeout: 10000 }).should("exist");
  });

  it("[Embedded] displays iPad toolbar", () => {
    cy.visit("/embedded");
    cy.get(".workspaceFunc", { timeout: 10000 }).should("exist");
    // Compile, Share, Reset icons exist in toolbar
    cy.get(".workspaceFunc svg.fa-clipboard-check").should("exist");
    cy.get(".workspaceFunc svg.fa-share-alt").should("exist");
    cy.get(".workspaceFunc svg.fa-share").should("exist");
  });

  it("[Embedded] displays workspace name component", () => {
    cy.visit("/embedded");
    cy.get(".workspaceFunc").find("div").should("exist");
  });

  it("[Embedded] displays device selection", () => {
    cy.visit("/embedded");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 10000 }).should("exist");
    cy.get('img[alt="Sensebox MCU"]').should("exist");
    cy.get('img[alt="Sensebox Mini"]').should("exist");
  });

  it("[Embedded] compiles code", () => {
    cy.intercept({ method: "POST", pathname: "/compile" }).as("compile");
    cy.visit("/embedded");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
    cy.get(".workspaceFunc svg.fa-clipboard-check").parents("button").click();
    cy.wait("@compile", { responseTimeout: 30000, requestTimeout: 30000 })
      .its("response.statusCode").should("eq", 200);
  });

  it("[Embedded] opens reset dialog", () => {
    cy.visit("/embedded");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
    cy.get(".workspaceFunc svg.fa-share").parents("button").click();
    cy.get('[role="dialog"]', { timeout: 5000 }).should("exist");
  });

  it("[Embedded] has proper viewport settings", () => {
    cy.visit("/embedded");
    cy.get('meta[name="viewport"]').should("have.attr", "content")
      .and("include", "width=device-width");
    cy.get('meta[name="viewport"]').should("have.attr", "content")
      .and("include", "user-scalable");
  });

  it("[Embedded] displays toolbox with search", () => {
    cy.visit("/embedded");
    cy.get(".blocklyToolbox", { timeout: 10000 }).should("exist");
    cy.get('input[type="search"]').should("exist");
  });

  it("[Embedded] marks toolbox xml as embedded mode", () => {
    cy.visit("/embedded");
    cy.get('xml#blockly').should("have.class", "embedded-mode");
  });
});

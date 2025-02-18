/// <reference types="cypress" />

describe("Blockly Editor Page Tests", () => {
  it("[Blockly] visits the editor page", () => {
    cy.visit("/");
  });

  it("[Blockly] selects senseBox ESP", () => {
    cy.visit("/");
    cy.get('img[alt="Sensebox ESP"]').click();
  });

  it("[Blockly] compiles code", () => {
    // intercept the request to the compiler

    cy.intercept({
      method: "POST",
      pathname: "/compile",
    }).as("compile");

    cy.visit("/");
    cy.get('img[alt="Sensebox ESP"]').click();
    cy.get('button[aria-label="Compile code"]').click();

    // check if the request was made
    cy.wait("@compile", {
      responseTimeout: 30000,
      requestTimeout: 30000,
    }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.property("data");
      expect(interception.response.body.data).to.have.property("id");
      expect(interception.response.body.data.id).to.be.a("string");
    });

  });
});

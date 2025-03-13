/// <reference types="cypress" />

describe("Blockly Editor Page Tests", () => {
  it("[Blockly] visits the editor page", () => {
    cy.visit("/");
  });

  it("[Blockly] visits the tutorial page", () => {
    cy.visit("/tutorial");
  });

  it("[Blockly] visits the gallery page", () => {
    cy.visit("/gallery");
  });

  it("[Blockly] visits the faq page", () => {
    cy.visit("/faq");
  });

  it("[Blockly] visits the settings page", () => {
    cy.visit("/settings");
  });

  it("[Blockly] visits the login page", () => {
    cy.visit("/user/login");
  });

  /// <reference types="cypress" />

  describe("Blockly Editor Page Tests", () => {
    it("[Blockly] visits the login page and performs a login request to the openSenseMap", () => {
      // Intercept the login request and force a 403 response
      cy.intercept("POST", "/user/login", {
        statusCode: 403,
        body: { error: "Forbidden" },
      }).as("loginRequest");

      // Visit the login page
      cy.visit("/user/login");

      // Fill in the login form with mock credentials
      cy.get("input[name='username']").type("mockUser@opensensemap.de");
      cy.get("input[name='password']").type("mockPassword");

      // Submit the login form (adjust the selector if necessary)
      cy.get("button[type='submit']").click();

      // Wait for the intercepted request and verify the 403 status code
      cy.wait("@loginRequest", {
        responseTimeout: 30000,
        requestTimeout: 30000,
      }).then((interception) => {
        expect(interception.response.statusCode).to.eq(403);
      });

      // Optionally, verify that an error message is displayed on the UI
      // (adjust the selector based on your actual error message element)
      cy.get(".error-message").should("contain", "Forbidden");
    });
  });

  it("[Blockly] selects senseBox ESP", () => {
    cy.visit("/");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
  });

  it("[Blockly] selects senseBox MCU", () => {
    cy.visit("/");
    cy.get('img[alt="Sensebox MCU"]', { timeout: 8000 }).click();
  });

  it("[Blockly] selects senseBox Mini", () => {
    cy.visit("/");
    cy.get('img[alt="Sensebox Mini"]', { timeout: 8000 }).click();
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

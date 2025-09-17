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

  it("[Blockly] navigates to tutorial and back", () => {
    cy.visit("/");
    cy.get('img[alt="Sensebox ESP"]').click();

    // get a button that has an SVG with the class "fa-bars" inside it
    // this is the button that opens the menu
    const menuButton = cy.get("button").find("svg.fa-bars").parents("button");

    // click the button
    menuButton.click();

    // click the a with href "/tutorial"
    cy.get('a[href="/tutorial"]').click();
    cy.wait(1000);
    cy.url().should("include", "/tutorial");
    cy.wait(1000);

    // click the button
    menuButton.click();

    // click the a with href "/" and deep inside it an span containing "Blockly"
    cy.get('a[href="/"]').find("span").contains("Blockly").parents("a").click();
    cy.wait(1000);
    cy.url().should("include", "/");

    cy.get('button[aria-label="Compile code"]').should("exist");
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
  }); /// <reference types="cypress" />

  it("[Blockly] changes the language in settings and verifies via headline", () => {
    cy.visit("/settings");

    cy.get("#language-selector").click();

    cy.get('li[data-value="en_US"]').click();

    cy.get("#settingsLanguage")
      .should("be.visible")
      .and("contain.text", "Language");

    // jetzt zurückwechseln auf Deutsch
    cy.get("#language-selector").click();
    cy.get('li[data-value="de_DE"]').click();

    // prüfen, ob die Überschrift wieder deutsch ist
    cy.get("#settingsLanguage")
      .should("be.visible")
      .and("contain.text", "Sprache");
  });

  it("[Blockly] changes to tablet mode and compiles code for esp32", () => {
    cy.intercept({
      method: "POST",
      pathname: "/compile",
    }).as("compile");

    cy.visit("/settings");
    cy.get("#ota-selector").click();
    cy.contains("li", "Activated").click();
    cy.visit("/");
    cy.contains("button", "Close").click();
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

  it("[Blockly] changes to tablet mode and compiles code for MCU", () => {
    cy.intercept({
      method: "POST",
      pathname: "/compile",
    }).as("compile");

    cy.visit("/settings");
    cy.get("#ota-selector").click();
    cy.contains("li", "Activated").click();
    cy.visit("/");
    cy.contains("button", "Close").click();
    cy.get('img[alt="Sensebox MCU"]').click();
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

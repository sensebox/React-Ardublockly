/// <reference types="cypress" />

describe("Blockly Editor Page Tests", () => {
  const boards = [
    { name: "senseBox ESP", alt: "Sensebox ESP", expected: "MCU-S2" },
    { name: "senseBox MCU", alt: "Sensebox MCU", expected: "MCU" },
    { name: "senseBox Mini", alt: "Sensebox Mini", expected: "MCU:MINI" },
  ];

  it("[Blockly] visits the editor page", () => {
    cy.visit("/");
  });

  it("[Blockly] visits the tutorial page", () => {
    cy.visit("/tutorial");

    cy.get("h1, h2, h3")
      .contains(/tutorial/i)
      .should("be.visible");
  });

  it("[Blockly] visits the gallery page", () => {
    cy.visit("/gallery");

    cy.get("h1, h2, h3, h4")
      .contains(/gallery/i)
      .should("be.visible");
  });

  it("[Blockly] visits the faq page", () => {
    cy.visit("/faq");

    // ✅ Check that a headline exists with the text "FAQ" (non case-sensitive)
    cy.get("h1, h2, h3")
      .invoke("text")
      .then((text) => {
        expect(text.toLowerCase()).to.include("faq");
      });
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

    // open the sidebar (button with fa-bars icon)
    const menuButton = cy.get("button").find("svg.fa-bars").parents("button");
    menuButton.click();

    // navigate to tutorial
    cy.get('a[href="/tutorial"]').click();
    cy.wait(1000);
    cy.url().should("include", "/tutorial");
    cy.wait(1000);

    // navigate back to blockly
    menuButton.click();
    cy.get('a[href="/"]').find("span").contains("Blockly").parents("a").click();
    cy.wait(1000);
    cy.url().should("include", "/");

    // check if compile button exists
    cy.get('button[aria-label="Compile code"]').should("exist");
  });
  // ✅ Extended board selection test (case-insensitive)
  boards.forEach((board) => {
    it(`[Blockly] selects ${board.name}`, () => {
      cy.visit("/");

      // Click the board image
      cy.get(`img[alt="${board.alt}"]`, { timeout: 8000 }).click();

      cy.wait(500); // give Redux and UI some time

      // ✅ Check sessionStorage (non case-sensitive)
      cy.window()
        .its("sessionStorage")
        .invoke("getItem", "board")
        .then((value) => {
          expect(value?.toLowerCase()).to.eq(board.expected.toLowerCase());
        });

      // ✅ Check the navbar text (non case-sensitive)
      cy.get("#navbar-selected-board")
        .should("be.visible")
        .invoke("text")
        .then((text) => {
          expect(text.trim().toLowerCase()).to.include(
            board.expected.toLowerCase(),
          );
        });
    });
  });

  it("[Blockly] changes the language in settings and verifies via headline", () => {
    cy.visit("/settings");

    cy.get("#language-selector").click();
    cy.get('li[data-value="en_US"]').click();

    cy.get("#settingsLanguage")
      .should("be.visible")
      .and("contain.text", "Language");

    // switch back to German
    cy.get("#language-selector").click();
    cy.get('li[data-value="de_DE"]').click();

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
    cy.intercept({
      method: "POST",
      pathname: "/compile",
    }).as("compile");

    cy.visit("/");
    cy.get('img[alt="Sensebox ESP"]').click();
    cy.get('button[aria-label="Compile code"]').click();

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

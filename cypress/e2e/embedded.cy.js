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
    cy.get(".embedded-toolbar", { timeout: 10000 }).should("exist");
    // Share, Reset icons exist
    cy.get(".embedded-toolbar svg.fa-share-nodes").should("exist");
    cy.get(".embedded-toolbar svg.fa-share").should("exist");

    // Select a board so Compile button becomes available
    cy.get('img[alt="Sensebox ESP"]', { timeout: 10000 }).click();
    cy.get(".embedded-toolbar svg.fa-clipboard-check").should("exist");
  });

  it("[Embedded] displays workspace name component", () => {
    cy.visit("/embedded");
    cy.get(".embedded-toolbar").find("div").should("exist");
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
    cy.get(".embedded-toolbar svg.fa-clipboard-check")
      .parents("button")
      .click();
    cy.wait("@compile", { responseTimeout: 30000, requestTimeout: 30000 })
      .its("response.statusCode")
      .should("eq", 200);
  });

  it("[Embedded] opens share dialog and generates short link", () => {
    cy.intercept({ method: "POST", pathname: "/share" }).as("share");
    cy.intercept({ method: "POST", url: "https://www.snsbx.de/api/shorty" }).as("shorty");
    cy.visit("/embedded");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
    
    // Click share button
    cy.get(".embedded-toolbar svg.fa-share-nodes")
      .parents("button")
      .click();
    
    // Wait for share API call (201 Created is valid for POST requests)
    cy.wait("@share", { responseTimeout: 10000 })
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);
    
    // Wait for short link creation and verify response structure
    cy.wait("@shorty", { responseTimeout: 10000 })
      .then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        // Verify response is an array with at least one element containing a link
        const responseBody = interception.response.body;
        expect(responseBody).to.be.an("array");
        expect(responseBody.length).to.be.greaterThan(0);
        expect(responseBody[0]).to.have.property("link");
        expect(responseBody[0].link).to.include("snsbx.de");
      });
    
    // Verify dialog opens
    cy.get('[role="dialog"]', { timeout: 5000 }).should("exist");
    
    // Wait for the link to be rendered with the short link URL
    // The link appears after React state updates (isFetching becomes false)
    cy.get('[role="dialog"]', { timeout: 10000 })
      .find("a")
      .should("exist")
      .and("be.visible")
      .and("have.attr", "href")
      .and((href) => {
        // Verify href is not empty and contains snsbx.de
        expect(href).to.be.a("string");
        expect(href.length).to.be.greaterThan(0);
        expect(href).to.include("snsbx.de");
      });
    
    // Also verify the link text (which should be the same as href)
    cy.get('[role="dialog"]')
      .find("a")
      .should("contain", "snsbx.de");
  });

  // Search box is currently disabled in embedded mode
  // it("[Embedded] displays toolbox with search", () => {
  //   cy.visit("/embedded");
  //   cy.get(".blocklyToolbox", { timeout: 10000 }).should("exist");
  //   cy.get('input[type="search"]').should("exist");
  // });

  it("[Embedded] marks toolbox xml as embedded mode", () => {
    cy.visit("/embedded");
    cy.get("xml#blockly").should("have.class", "embedded-mode");
  });

  it("[Embedded] uses tablet mode for compilation with embedded-specific text", () => {
    cy.intercept({ method: "POST", pathname: "/compile" }).as("compile");

    cy.visit("/embedded");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 10000 }).click();
    cy.get(".embedded-toolbar svg.fa-clipboard-check")
      .parents("button")
      .click();

    cy.wait("@compile", { responseTimeout: 30000, requestTimeout: 30000 })
      .its("response.statusCode")
      .should("eq", 200);

    cy.get('[role="dialog"]', { timeout: 10000 }).should("exist");

    // Verify embedded mode specific elements
    cy.get('[role="dialog"]').should(
      "contain.text",
      "Gehe zum Übertragungs-Tab",
    );
    cy.get('[role="dialog"]').should(
      "contain.text",
      "Over-The-Air Übertragung",
    );
    cy.get('[role="dialog"]').should(
      "contain.text",
      "Der Code wurde erfolgreich kompiliert",
    );
    cy.get('[role="dialog"]').should(
      "contain.text",
      "Klicke den unteren Button um zum Übertragungs-Tab zu gelangen",
    );

    // Verify stepper configuration
    cy.get('[role="dialog"]').within(() => {
      cy.get(".MuiStep-root").should("have.length", 2);
      cy.get(".MuiStep-root").first().should("contain.text", "Kompilieren");
      cy.get(".MuiStep-root").last().should("contain.text", "Übertragen");
      cy.get(".MuiStepLabel-label").should("not.contain.text", "Herunterladen");
      cy.get('a[href*="blocklyconnect-app://"]').should("exist");
    });
  });
});

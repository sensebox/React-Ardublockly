/// <reference types="cypress" />

describe("Embedded Blockly Page Tests", () => {
  it("[Embedded] visits the embedded page", () => {
    cy.visit("/embedded");
    cy.url().should("include", "/embedded");
  });

  it("[Embedded] displays Blockly workspace", () => {
    cy.visit("/embedded");
    
    // Check if Blockly workspace is rendered
    cy.get(".blocklyWorkspace", { timeout: 10000 }).should("exist");
    cy.get(".blocklySvg", { timeout: 10000 }).should("exist");
  });

  it("[Embedded] displays iPad toolbar", () => {
    cy.visit("/embedded");
    
    // Check if iPad toolbar is present
    cy.get(".workspaceFunc", { timeout: 10000 }).should("exist");
    
    // Check for toolbar buttons (compile, share, reset)
    cy.get('button[aria-label="Compile code"]').should("exist");
    cy.get('button[aria-label="Share project"]').should("exist");
    cy.get('button[aria-label="Reset workspace"]').should("exist");
  });

  it("[Embedded] displays workspace name component", () => {
    cy.visit("/embedded");
    
    // Check if workspace name is displayed
    cy.get(".workspaceFunc").within(() => {
      cy.get("div").should("contain.text", "Untitled"); // Default workspace name
    });
  });

  it("[Embedded] displays device selection", () => {
    cy.visit("/embedded");
    
    // Check if device selection is present
    cy.get('img[alt="Sensebox ESP"]', { timeout: 10000 }).should("exist");
    cy.get('img[alt="Sensebox MCU"]').should("exist");
    cy.get('img[alt="Sensebox Mini"]').should("exist");
  });

  it("[Embedded] selects senseBox ESP device", () => {
    cy.visit("/embedded");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
    
    // Verify the device is selected (you might need to adjust this based on actual behavior)
    cy.get('img[alt="Sensebox ESP"]').should("have.class", "selected");
  });

  it("[Embedded] compiles code", () => {
    // Intercept the compile request
    cy.intercept({
      method: "POST",
      pathname: "/compile",
    }).as("compile");

    cy.visit("/embedded");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
    cy.get('button[aria-label="Compile code"]').click();

    // Check if the request was made
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

  it("[Embedded] opens reset dialog", () => {
    cy.visit("/embedded");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
    cy.get('button[aria-label="Reset workspace"]').click();
    
    // Check if reset dialog appears
    cy.get("button").contains("Reset").should("exist");
    cy.get("button").contains("Cancel").should("exist");
  });

  it("[Embedded] has proper viewport settings", () => {
    cy.visit("/embedded");
    
    // Check viewport meta tag for mobile optimization
    cy.get('meta[name="viewport"]').should("have.attr", "content").and("include", "width=device-width");
    cy.get('meta[name="viewport"]').should("have.attr", "content").and("include", "user-scalable=yes");
  });

  it("[Embedded] displays toolbox with search", () => {
    cy.visit("/embedded");
    
    // Check if toolbox is present
    cy.get(".blocklyToolbox", { timeout: 10000 }).should("exist");
    
    // Check if search functionality is present
    cy.get('input[type="search"]').should("exist");
    cy.get('input[placeholder="Search"]').should("exist");
  });

  it("[Embedded] has embedded mode CSS class", () => {
    cy.visit("/embedded");
    
    // Check if embedded mode class is applied
    cy.get(".blocklyWorkspace").should("have.class", "embedded-mode");
  });
});

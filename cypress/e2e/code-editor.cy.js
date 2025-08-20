/// <reference types="cypress" />

describe("Code Editor Page Tests", () => {
  it("[CodeEditor] visits the code editor page", () => {
    cy.visit("/codeeditor");
  });

  it("[CodeEditor] selects senseBox ESP", () => {
    cy.visit("/codeeditor");
    cy.get('img[alt="Sensebox ESP"]').click();
  });

  it("[CodeEditor] compiles code", () => {
    cy.visit("/codeeditor");
    cy.get('img[alt="Sensebox ESP"]').click();
    cy.get("#compile").click();
  });

  it("[CodeEditor] opens reset dialog", () => {
    cy.visit("/codeeditor");
    cy.get('img[alt="Sensebox ESP"]').click();
    cy.get("button").contains("Reset code").click();
    cy.get("button").contains("Reset").should("exist");
  });

  it("[CodeEditor] fetches libraries", () => {
    // intercept the request to the libraries endpoint
    cy.intercept({
      method: "GET",
      pathname: "/libraries",
      query: {
        format: "json",
      },
    }).as("getLibraries");

    cy.visit("/codeeditor");
    cy.get('img[alt="Sensebox ESP"]').click();

    // check if the request was successful
    cy.wait("@getLibraries").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.property(
        "installed_libraries",
      );
      expect(interception.response.body.installed_libraries).to.be.an("array")
        .that.is.not.empty;
    });
  });
});

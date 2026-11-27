/// <reference types="cypress" />

describe("Toolbox search", () => {
  const boards = [
    { name: "senseBox ESP", alt: "Sensebox ESP" },
    { name: "senseBox MCU", alt: "Sensebox MCU" },
  ];

  const openEditor = (alt) => {
    cy.visit("/");
    cy.get(`img[alt="${alt}"]`, { timeout: 8000 }).click();
    cy.get('.blocklyToolbox input[type="search"]', { timeout: 10000 }).should(
      "be.visible",
    );
  };

  boards.forEach((board) => {
    it(`[Toolbox] finds blocks via search on ${board.name}`, () => {
      openEditor(board.alt);

      cy.get('.blocklyToolbox input[type="search"]').click().type("sensebox");

      cy.get(".blocklyToolboxFlyout .blocklyDraggable", { timeout: 5000 })
        .should("have.length.greaterThan", 0)
        .and("be.visible");
    });
  });

  it("[Toolbox] finds all blocks of a category by its name", () => {
    openEditor("Sensebox ESP");

    // Count the blocks of the logic category ("Logik" / "Logic")
    cy.contains(".blocklyToolboxCategory", /^(Logik|Logic)$/).click();
    cy.get(".blocklyToolboxFlyout .blocklyDraggable", { timeout: 5000 })
      .its("length")
      .then((categoryCount) => {
        // "logi" matches the category name in German and English; blocks like
        // controls_if contain no "logi" text and are only found via the category
        cy.get('.blocklyToolbox input[type="search"]').click().type("logi");
        cy.get(".blocklyToolboxFlyout .blocklyDraggable", {
          timeout: 5000,
        }).should("have.length.at.least", categoryCount);
      });
  });

  it("[Toolbox] shows a hint for short queries and a message for no results", () => {
    openEditor("Sensebox ESP");

    cy.get('.blocklyToolbox input[type="search"]').click().type("ab");
    cy.get(".blocklyToolboxFlyout .blocklyFlyoutLabelText")
      .invoke("text")
      .should("match", /3/);
    cy.get(".blocklyToolboxFlyout .blocklyDraggable").should("not.exist");

    cy.get('.blocklyToolbox input[type="search"]').type("xqzxqz");
    cy.get(".blocklyToolboxFlyout .blocklyFlyoutLabelText")
      .invoke("text")
      .should("match", /Keine passenden Blöcke|No matching blocks/);
  });
});

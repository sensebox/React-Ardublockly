/// <reference types="cypress" />

// Picks an option from an MUI <Select> identified by the data-testid on its
// hidden input.
const selectOption = (testId, optionText, index = 0) => {
  cy.get(`[data-testid="${testId}"]`)
    .eq(index)
    .parent()
    .find('[role="combobox"], [role="button"]')
    .first()
    .click();
  cy.get('[role="listbox"]').contains("li", optionText).click();
};

describe("Orientation classification – custom decision tree", () => {
  beforeEach(() => {
    cy.visit("/teachable/orientation", {
      onBeforeLoad(win) {
        win.localStorage.setItem("locale", "de_DE");
      },
    });
  });

  it("shows a red outline until the custom tree is valid, then green", () => {
    // Load example classes ("gerade", "schief") so leaves have options
    cy.contains("button", /Beispieldatensatz|Example Dataset/i).click();
    cy.get('[role="menu"] li').first().click();

    // "Build my own" is the default mode
    cy.get('[data-testid="tree-mode-custom"]').should(
      "have.attr",
      "aria-pressed",
      "true",
    );

    // Initial decision with defaults (x ≤ 0) and two open branch ends
    cy.get('[data-testid="custom-tree-view"]').should(
      "have.attr",
      "data-valid",
      "false",
    );
    cy.get('[data-testid="custom-tree-decision"]').should("have.length", 1);
    cy.get('[data-testid="custom-tree-feature"]').should("have.value", "x");
    cy.get('[data-testid="custom-tree-decision"]').should("contain.text", "≤");
    cy.get('[data-testid="custom-tree-threshold"]').should("have.value", "0");
    cy.get('[data-testid="custom-tree-empty"]').should("have.length", 2);

    // Choose another input via the dropdown, then back to x
    selectOption("custom-tree-feature", "y");
    cy.get('[data-testid="custom-tree-feature"]').should("have.value", "y");
    selectOption("custom-tree-feature", "x");

    // Change the root decision to x ≤ -2
    cy.get('[data-testid="custom-tree-threshold"]').clear().type("-2");

    // Add one leaf: still invalid because the other branch is open
    cy.get('[data-testid="custom-tree-add-leaf"]').first().click();
    cy.get('[data-testid="custom-tree-view"]').should(
      "have.attr",
      "data-valid",
      "false",
    );

    // Second leaf: leaves default to the first orientation, so it's valid
    cy.get('[data-testid="custom-tree-add-leaf"]').first().click();
    cy.get('[data-testid="custom-tree-leaf"]').should("have.length", 2);
    cy.get('[data-testid="custom-tree-leaf"]')
      .first()
      .should("contain.text", "gerade");
    selectOption("custom-tree-class", "schief", 0);
    cy.get('[data-testid="custom-tree-leaf"]')
      .first()
      .should("contain.text", "schief");

    cy.get('[data-testid="custom-tree-view"]')
      .should("have.attr", "data-valid", "true")
      .and("have.css", "border-top-color", "rgb(46, 125, 50)");

    // An invalid threshold makes the tree invalid again
    cy.get('[data-testid="custom-tree-threshold"]').clear().type("abc");
    cy.get('[data-testid="custom-tree-view"]').should(
      "have.attr",
      "data-valid",
      "false",
    );

    // Custom tree survives switching back and forth
    cy.get('[data-testid="custom-tree-threshold"]').clear().type("-2");
    cy.get('[data-testid="tree-mode-generated"]').click();
    cy.get('[data-testid="custom-tree-view"]').should("not.exist");

    // The generated tree is shown read-only in the same style
    cy.get('[data-testid="generated-tree-view"]')
      .should("contain.text", "≤")
      .find("input, [role='combobox'], button")
      .should("not.exist");

    // The tree can be panned by dragging anywhere in the frame
    cy.get('[data-testid="generated-tree-view"]').then(($frame) => {
      expect($frame[0].scrollWidth).to.be.greaterThan($frame[0].clientWidth);
    });
    cy.get('[data-testid="generated-tree-view"]')
      .trigger("pointerdown", 600, 20, {
        pointerType: "mouse",
        button: 0,
        pointerId: 1,
      })
      .trigger("pointermove", 400, 20, { pointerType: "mouse", pointerId: 1 })
      .trigger("pointerup", 400, 20, { pointerType: "mouse", pointerId: 1 })
      .its("0.scrollLeft")
      .should("equal", 200);

    cy.get('[data-testid="tree-mode-custom"]').click();
    cy.get('[data-testid="custom-tree-view"]').should(
      "have.attr",
      "data-valid",
      "true",
    );
  });
});

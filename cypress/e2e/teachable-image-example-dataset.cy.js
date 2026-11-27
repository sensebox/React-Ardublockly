/// <reference types="cypress" />

// Example dataset in the image classification tool (/teachable/image).
// Uses data-testids only, so the tests work in both UI languages.
describe("Teachable image classification – example dataset", () => {
  const loadExampleDataset = () => {
    cy.get('[data-testid="example-dataset-button"]').click();
    cy.get('[data-testid="example-dataset-option-wuerfel-apfel"]').click();
  };

  beforeEach(() => {
    cy.visit("/teachable/image");
    cy.get('[data-testid="example-dataset-button"]', { timeout: 15000 }).should(
      "be.visible",
    );
  });

  it("[Teachable] loads the example dataset read-only", () => {
    loadExampleDataset();

    // Two classes with 19 training images each
    cy.get('[data-testid="class-sample-card"]', { timeout: 15000 }).should(
      "have.length",
      2,
    );
    cy.get('[data-testid="class-sample-card"]').each(($card) => {
      cy.wrap($card).find("img").should("have.length", 19);
    });

    // Classes and images can't be changed
    cy.get('[data-testid="remove-sample-button"]').should("not.exist");
    cy.get('[data-testid="add-class-button"]').should("not.exist");

    // Camera buttons are replaced by the unload button
    cy.get('[data-testid="start-webcam-button"]').should("not.exist");
    cy.get('[data-testid="example-dataset-button"]').should("not.exist");
    cy.get('[data-testid="example-dataset-unload"]').should("be.visible");
  });

  it("[Teachable] hides slideshow and locks test tab until trained", () => {
    loadExampleDataset();
    cy.get('[data-testid="class-sample-card"]', { timeout: 15000 }).should(
      "have.length",
      2,
    );

    cy.get('[data-testid="example-slideshow-image"]').should("not.exist");
    cy.get('[data-testid="test-tab"]').should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Clicking the locked tab keeps the training view
    cy.get('[data-testid="test-tab"]').click();
    cy.get('[data-testid="train-tab"]').should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.get('[data-testid="class-sample-card"]').each(($card) => {
      cy.wrap($card).find("img").should("have.length", 19);
    });
  });

  // Downloads the base model from GitHub, like the app itself
  it("[Teachable] trains on the example dataset and shows predictions", () => {
    loadExampleDataset();
    cy.get('[data-testid="train-model-button"]', { timeout: 15000 }).click();

    // Slideshow with predictions once the training has finished
    cy.get('[data-testid="example-slideshow-image"]', { timeout: 120000 })
      .should("be.visible")
      .invoke("attr", "src")
      .then((firstSrc) => {
        expect(firstSrc).to.match(/^blob:/);
        // 0.5 FPS: the next image appears after 2 seconds
        cy.get('[data-testid="example-slideshow-image"]', { timeout: 4000 })
          .invoke("attr", "src")
          .should("not.eq", firstSrc);
      });
    cy.contains(/^\d+\.\d%$/).should("be.visible");

    // Test section with the 10 test images per class, still read-only
    cy.get('[data-testid="test-tab"]').should("not.have.attr", "aria-disabled");
    cy.get('[data-testid="test-tab"]').click();
    cy.get('[data-testid="test-tab"]').should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.get('[data-testid="class-sample-card"]').each(($card) => {
      cy.wrap($card).find("img").should("have.length", 10);
    });
    cy.get('[data-testid="remove-sample-button"]').should("not.exist");

    // Unloading discards the model and stops the slideshow
    cy.get('[data-testid="example-dataset-unload"]').click();
    cy.get('[data-testid="example-slideshow-image"]').should("not.exist");
    cy.get('[data-testid="test-tab"]').should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.get('[data-testid="train-tab"]').should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.contains(/^\d+\.\d%$/).should("not.exist");
  });

  it("[Teachable] unloads the example dataset", () => {
    loadExampleDataset();
    cy.get('[data-testid="class-sample-card"]', { timeout: 15000 }).should(
      "have.length",
      2,
    );

    cy.get('[data-testid="example-dataset-unload"]').click();

    cy.get('[data-testid="class-sample-card"]').should("not.exist");
    cy.get('[data-testid="example-slideshow-image"]').should("not.exist");
    cy.get('[data-testid="start-webcam-button"]').should("be.visible");
    cy.get('[data-testid="example-dataset-button"]').should("be.visible");
    cy.get('[data-testid="add-class-button"]').should("be.visible");
  });

  it("[Teachable] asks before replacing existing classes", () => {
    // Create an own class
    cy.get('[data-testid="add-class-button"]').click();
    cy.get('[role="dialog"] input').type("Meine Klasse{enter}");
    cy.get('[data-testid="class-sample-card"]').should("have.length", 1);

    // Cancel keeps the own class
    loadExampleDataset();
    cy.get('[role="dialog"]').should("be.visible");
    cy.get('[role="dialog"] button').first().click();
    cy.get('[data-testid="class-sample-card"]')
      .should("have.length", 1)
      .and("contain", "Meine Klasse");
    cy.get('[data-testid="example-dataset-unload"]').should("not.exist");

    // Confirm replaces it with the example dataset
    loadExampleDataset();
    cy.get('[data-testid="example-dataset-confirm"]').click();
    cy.get('[data-testid="class-sample-card"]', { timeout: 15000 })
      .should("have.length", 2)
      .and("not.contain", "Meine Klasse");
  });
});

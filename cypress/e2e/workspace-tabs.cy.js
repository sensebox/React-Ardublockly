/// <reference types="cypress" />

describe("Workspace Tabs", () => {
  const tabs = () => cy.get('[data-testid="workspace-tab"]');
  const block = () => cy.get(".blocklyBlockCanvas > .blocklyDraggable").first();
  const storedTabs = () =>
    cy
      .window()
      .its("localStorage")
      .invoke("getItem", "workspaceTabs")
      .then((value) => JSON.parse(value));

  // Blockly needs real PointerEvents with coordinates to start a drag
  const dragStartBlock = () => {
    block()
      .find(".blocklyPath")
      .first()
      .then(($path) => {
        const rect = $path[0].getBoundingClientRect();
        const x = rect.left + 20;
        const y = rect.top + 20;
        const pointer = {
          eventConstructor: "PointerEvent",
          pointerId: 1,
          isPrimary: true,
          pointerType: "mouse",
          button: 0,
          buttons: 1,
          bubbles: true,
          force: true,
        };
        cy.wrap($path).trigger("pointerdown", {
          ...pointer,
          clientX: x,
          clientY: y,
        });
        cy.document()
          .trigger("pointermove", {
            ...pointer,
            clientX: x + 30,
            clientY: y + 30,
          })
          .trigger("pointermove", {
            ...pointer,
            clientX: x + 150,
            clientY: y + 120,
          })
          .trigger("pointerup", {
            ...pointer,
            buttons: 0,
            clientX: x + 150,
            clientY: y + 120,
          });
      });
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
    tabs().should("have.length", 1);
  });

  it("[Tabs] adds a tab and keeps tabs after reload", () => {
    cy.get('[data-testid="workspace-tab-add"]').click();

    tabs().should("have.length", 2);
    tabs().eq(1).should("have.attr", "aria-selected", "true");
    storedTabs().its("tabs").should("have.length", 2);

    cy.reload();
    tabs().should("have.length", 2);
    tabs().eq(1).should("have.attr", "aria-selected", "true");
  });

  it("[Tabs] keeps a separate program per tab", () => {
    block()
      .invoke("attr", "transform")
      .then((initialTransform) => {
        cy.get('[data-testid="workspace-tab-add"]').click();
        tabs().should("have.length", 2);

        dragStartBlock();
        block().should("not.have.attr", "transform", initialTransform);

        tabs().eq(0).click();
        block().should("have.attr", "transform", initialTransform);

        // positions are rounded when stored as XML, so only check that the
        // moved block came back instead of comparing exact coordinates
        tabs().eq(1).click();
        block().should("not.have.attr", "transform", initialTransform);
      });
  });

  it("[Tabs] keeps a separate board per tab", () => {
    cy.get('[data-testid="workspace-tab-add"]').click();
    tabs().should("have.length", 2);

    cy.get("#navbar-selected-board").click();
    cy.get("#navbarBoardSelect").contains("li", /^MCU$/).click();
    cy.get("#navbar-selected-board").should("have.text", "MCU");

    tabs().eq(0).click();
    cy.get("#navbar-selected-board").should("have.text", "MCU-S2");

    tabs().eq(1).click();
    cy.get("#navbar-selected-board").should("have.text", "MCU");
  });

  it("[Tabs] duplicates a tab with its program via the duplicate button", () => {
    block()
      .invoke("attr", "transform")
      .then((initialTransform) => {
        dragStartBlock();
        block().should("not.have.attr", "transform", initialTransform);

        tabs().eq(0).find('[data-testid="workspace-tab-duplicate"]').click();

        tabs().should("have.length", 2);
        tabs().eq(1).should("have.attr", "aria-selected", "true");
        tabs()
          .eq(1)
          .find('[data-testid="workspace-tab-name"]')
          .should("contain.text", "(Kopie)");
        // the copy contains the moved block, not the initial program
        block().should("not.have.attr", "transform", initialTransform);

        storedTabs()
          .its("tabs")
          .then((stored) => {
            expect(stored[1].xml).to.eq(stored[0].xml);
            expect(stored[1].board).to.eq(stored[0].board);
          });
      });
  });

  it("[Tabs] closes a tab after confirmation", () => {
    cy.get('[data-testid="workspace-tab-add"]').click();
    tabs().should("have.length", 2);

    tabs().eq(1).find('[data-testid="workspace-tab-close"]').click();
    cy.get('[data-testid="workspace-tab-close-confirm"]').click();

    tabs().should("have.length", 1);
    tabs().eq(0).should("have.attr", "aria-selected", "true");
    storedTabs().its("tabs").should("have.length", 1);
    // the last tab can't be closed
    cy.get('[data-testid="workspace-tab-close"]').should("not.exist");
  });
  it("[Tabs] closes all tabs and keeps one empty tab", () => {
    // not offered with a single tab
    cy.get('[data-testid="workspace-tab-close-all"]').should("not.exist");

    cy.get('[data-testid="workspace-tab-add"]').click();
    cy.get('[data-testid="workspace-tab-add"]').click();
    tabs().should("have.length", 3);

    storedTabs().then(({ tabs: before }) => {
      cy.get('[data-testid="workspace-tab-close-all"]').click();
      cy.get('[data-testid="workspace-tab-close-confirm"]').click();

      tabs().should("have.length", 1);
      tabs().eq(0).should("have.attr", "aria-selected", "true");
      storedTabs()
        .its("tabs")
        .then((after) => {
          expect(after).to.have.length(1);
          // a fresh tab, none of the closed ones
          expect(before.map((t) => t.id)).not.to.include(after[0].id);
        });
      cy.get('[data-testid="workspace-tab-close-all"]').should("not.exist");
    });
  });

  it("[Tabs] renames a tab inline via double-click", () => {
    cy.get('[data-testid="workspace-tab-name"]').first().dblclick();
    cy.get('[data-testid="workspace-tab-name-input"]')
      .clear()
      .type("Wetterstation{enter}");

    cy.get('[data-testid="workspace-tab-name"]')
      .first()
      .should("have.text", "Wetterstation");
    storedTabs().its("tabs.0.name").should("eq", "Wetterstation");
  });

  it("[Tabs] shortens names longer than 24 characters", () => {
    cy.get('[data-testid="workspace-tab-name"]').first().dblclick();
    cy.get('[data-testid="workspace-tab-name-input"]')
      .clear()
      .type("Wetterstation mit Feinstaubsensor{enter}");

    cy.get('[data-testid="workspace-tab-name"]')
      .first()
      .should("have.text", "Wetterstation mit Feinst…");
    // the full name is kept
    storedTabs()
      .its("tabs.0.name")
      .should("eq", "Wetterstation mit Feinstaubsensor");
  });

  it("[Tabs] renames a tab via the pencil button", () => {
    cy.get('[data-testid="workspace-tab-add"]').click();
    tabs().should("have.length", 2);

    // only the active (second) tab shows the pencil
    cy.get('[data-testid="workspace-tab-rename"]').should("have.length", 1);
    tabs()
      .eq(0)
      .find('[data-testid="workspace-tab-rename"]')
      .should("not.exist");

    tabs().eq(1).find('[data-testid="workspace-tab-rename"]').click();
    cy.get('[data-testid="workspace-tab-name-input"]')
      .clear()
      .type("Mit Stift{enter}");

    tabs()
      .eq(1)
      .find('[data-testid="workspace-tab-name"]')
      .should("have.text", "Mit Stift");
  });

  it("[Tabs] cancels renaming with Escape and renames via F2", () => {
    cy.get('[data-testid="workspace-tab-name"]')
      .first()
      .invoke("text")
      .then((originalName) => {
        cy.get('[data-testid="workspace-tab-name"]').first().dblclick();
        cy.get('[data-testid="workspace-tab-name-input"]')
          .clear()
          .type("Verworfen{esc}");
        cy.get('[data-testid="workspace-tab-name"]')
          .first()
          .should("have.text", originalName);
      });

    tabs().first().focus().trigger("keydown", { key: "F2" });
    cy.get('[data-testid="workspace-tab-name-input"]')
      .clear()
      .type("Per F2{enter}");
    cy.get('[data-testid="workspace-tab-name"]')
      .first()
      .should("have.text", "Per F2");
  });

  it("[Tabs] reorders tabs via drag and drop", () => {
    cy.get('[data-testid="workspace-tab-add"]').click();
    tabs().should("have.length", 2);

    storedTabs().then(({ tabs: before }) => {
      const dataTransfer = new DataTransfer();
      tabs().eq(1).trigger("dragstart", { dataTransfer });
      tabs().eq(0).trigger("dragover", { dataTransfer });
      tabs().eq(0).trigger("drop", { dataTransfer });
      tabs().eq(1).trigger("dragend", { dataTransfer });

      storedTabs()
        .its("tabs")
        .then((after) => {
          expect(after.map((t) => t.id)).to.deep.eq([
            before[1].id,
            before[0].id,
          ]);
        });
      // the moved tab stays the active one
      tabs().eq(0).should("have.attr", "aria-selected", "true");
    });
  });
});

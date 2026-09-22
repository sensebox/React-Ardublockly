/// <reference types="cypress" />
describe("Qwiic Button toolbox integration", () => {
  for (const board of ["MCU-S2", "MCU", "MCU:MINI", "MCU-EYE"]) {
    it(`includes the category in the ${board} toolbox`, () => {
      cy.visit("/", {
        onBeforeLoad(win) {
          win.sessionStorage.setItem("board", board);
          win.localStorage.setItem("locale", "en_US");
        },
      });
      cy.contains(".blocklyTreeLabel", "Qwiic Button", {
        timeout: 15000,
      }).should("exist");
    });
  }
});

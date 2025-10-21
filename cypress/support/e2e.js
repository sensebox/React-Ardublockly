// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
// cypress/support/e2e.js
Cypress.on("uncaught:exception", (err, runnable) => {
  // Prüfe auf bekannte Monaco-Fehler
  if (
    err.message.includes("LoadError") ||
    err.message.includes("loader.js") ||
    err.message.includes("monaco-editor") ||
    err.message.includes("[object Event]") // Dein spezifischer Fehler
  ) {
    // Verhindere, dass Cypress den Test abbricht
    return false;
  }
  // Bei allen anderen Fehlern: Test abbrechen
  return true;
});

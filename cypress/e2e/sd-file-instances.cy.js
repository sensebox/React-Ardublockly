/// <reference types="cypress" />

/**
 * SD file instances: "Erstelle Datei" defines a file instance with its own
 * instance name ("Messdaten") and a file name ("Data.csv"). The instance
 * block references the create block and shows the instance name.
 */
describe("SD file instances", () => {
  const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_functions" id="start" x="27" y="16">
    <statement name="SETUP_FUNC">
      <block type="sensebox_sd_create_file" id="c1">
        <field name="extension">csv</field>
        <value name="INSTANCE"><block type="sensebox_sd_file_instance_name" id="n1" movable="false" deletable="false"><field name="NAME">Messdaten</field></block></value>
        <value name="FILENAME"><block type="text" id="t1"><field name="TEXT">Data</field></block></value>
      </block>
    </statement>
    <statement name="LOOP_FUNC">
      <block type="sensebox_sd_open_file" id="o1">
        <field name="extension">txt</field>
        <value name="FILENAME"><block type="sensebox_sd_file_instance" id="f1"><field name="FILE">c1</field></block></value>
      </block>
    </statement>
  </block>
</xml>`;

  const fileRef = (win) => {
    const doc = new DOMParser().parseFromString(
      win.localStorage.getItem("autoSaveXML") || "",
      "text/xml",
    );
    return doc.querySelector('block[id="f1"] > field[name="FILE"]')
      ?.textContent;
  };

  const fileLabel = () => cy.get('g[data-id="f1"] .blocklyDropdownText');

  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("autoSaveXML", xml);
      },
    });
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
    cy.get(".blocklyMainBackground", { timeout: 8000 }).should("exist");
  });

  it("[SD] instance block shows the instance name, not the file name", () => {
    fileLabel().should("contain.text", "Messdaten");

    // renaming the file changes nothing in the instance block
    cy.get('g[data-id="t1"] .blocklyEditableField').first().click();
    cy.get(".blocklyHtmlInput").clear().type("Messung{enter}");
    fileLabel().should("contain.text", "Messdaten");

    // renaming the instance shows the new name, the reference stays
    cy.get('g[data-id="n1"] .blocklyEditableField').first().click();
    cy.get(".blocklyHtmlInput").clear().type("Wetter{enter}");
    fileLabel().should("contain.text", "Wetter");

    // AutoSave writes the workspace XML with a 400 ms debounce
    cy.window({ timeout: 5000 }).should((win) => {
      expect(fileRef(win)).to.eq("c1");
    });
  });
});

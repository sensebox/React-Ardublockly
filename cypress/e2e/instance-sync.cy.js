/// <reference types="cypress" />

/**
 * LED matrix instances: init blocks define named instances ("Matrix 1" on
 * port A, "Matrix 2" on port B) with a fixed name block. Blocks get an
 * instance block plugged in; their (hidden) port follows that instance.
 */
describe("Block instances", () => {
  const wrap = (
    setup,
    loop,
  ) => `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_functions" id="start" x="27" y="16">
    <statement name="SETUP_FUNC">${setup}</statement>
    <statement name="LOOP_FUNC">${loop}</statement>
  </block>
</xml>`;

  const inst = (type, id, name) =>
    `<value name="INSTANCE"><block type="${type}" id="${id}"><field name="INSTANCE">${name}</field></block></value>`;
  const matrixInst = (id, name) =>
    inst("sensebox_ws2812_matrix_instance", id, name);
  const matrixName = (id, name) =>
    `<value name="INSTANCE"><block type="sensebox_ws2812_matrix_instance_name" id="${id}" movable="false" deletable="false"><field name="NAME">${name}</field></block></value>`;

  const twoMatricesXml = wrap(
    `<block type="sensebox_ws2812_matrix_init" id="i1">
      <field name="Port">2</field>${matrixName("n1", "Matrix 1")}
      <field name="BRIGHTNESS">20</field>
      <next><block type="sensebox_ws2812_matrix_init" id="i2">
        <field name="Port">4</field>${matrixName("n2", "Matrix 2")}
        <field name="BRIGHTNESS">20</field>
      </block></next>
    </block>`,
    `<block type="sensebox_ws2812_matrix_clear" id="d1">
      <field name="Port">2</field>${matrixInst("x1", "Matrix 1")}
      <next><block type="sensebox_ws2812_matrix_fullcolor" id="d2">
        <field name="Port">4</field>${matrixInst("x2", "Matrix 2")}
      </block></next>
    </block>`,
  );

  // Format before instances existed: only "Port" fields
  const oldProjectXml = wrap(
    `<block type="sensebox_ws2812_matrix_init" id="i1">
      <field name="Port">2</field><field name="BRIGHTNESS">20</field>
      <next><block type="sensebox_ws2812_matrix_init" id="i2">
        <field name="Port">4</field><field name="BRIGHTNESS">20</field>
      </block></next>
    </block>`,
    `<block type="sensebox_ws2812_matrix_clear" id="d1">
      <field name="Port">4</field>
      <next><block type="sensebox_ws2812_matrix_fullcolor" id="d2">
        <field name="Port">2</field>
      </block></next>
    </block>`,
  );

  const fieldsIn = (xml, ids) => {
    const doc = new DOMParser().parseFromString(xml || "", "text/xml");
    const get = (selector) => doc.querySelector(selector)?.textContent;
    // init blocks: name block@Port, other blocks: plugged-in instance@Port
    return ids.map((id) => {
      const plugged = `block[id="${id}"] > value[name="INSTANCE"] > block`;
      const name =
        get(`${plugged} > field[name="NAME"]`) ??
        get(`${plugged} > field[name="INSTANCE"]`);
      return `${name}@${get(`block[id="${id}"] > field[name="Port"]`)}`;
    });
  };

  // AutoSave writes the workspace XML with a 400 ms debounce
  const expectState = (ids, expected) => {
    cy.window({ timeout: 5000 }).should((win) => {
      const xml = win.localStorage.getItem("autoSaveXML");
      expect(fieldsIn(xml, ids)).to.deep.eq(expected);
    });
  };

  const openEditor = (xml) => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("autoSaveXML", xml);
      },
    });
    cy.get('img[alt="Sensebox ESP"]', { timeout: 8000 }).click();
    cy.get(".blocklyMainBackground", { timeout: 8000 }).should("exist");
  };

  // first dropdown of a block: port on init blocks, name on instance blocks
  const choose = (blockId, label) => {
    cy.get(`g[data-id="${blockId}"] .blocklyDropdownField`).first().click();
    cy.get(".blocklyDropdownMenu .blocklyMenuItem")
      .contains(new RegExp(`^${label}$`))
      .click();
  };

  const undo = () => {
    cy.get(".blocklyMainBackground").rightclick({ force: true });
    cy.get(".blocklyContextMenu .blocklyMenuItem")
      .contains("Rückgängig")
      .click();
  };

  const ids = ["i1", "i2", "d1", "d2"];

  it("[Instances] port change only affects blocks of that instance", () => {
    openEditor(twoMatricesXml);
    expectState(ids, ["Matrix 1@2", "Matrix 2@4", "Matrix 1@2", "Matrix 2@4"]);

    choose("i1", "C");
    expectState(ids, ["Matrix 1@6", "Matrix 2@4", "Matrix 1@6", "Matrix 2@4"]);

    // one undo step reverts the init block and its blocks
    undo();
    expectState(ids, ["Matrix 1@2", "Matrix 2@4", "Matrix 1@2", "Matrix 2@4"]);
  });

  it("[Instances] switching the instance of a block switches its port", () => {
    openEditor(twoMatricesXml);
    // dropdown of the instance block plugged into d2
    choose("x2", "Matrix 1");
    expectState(ids, ["Matrix 1@2", "Matrix 2@4", "Matrix 1@2", "Matrix 1@2"]);
  });

  it("[Instances] old projects are assigned to instances by port", () => {
    openEditor(oldProjectXml);
    expectState(ids, ["Matrix 1@2", "Matrix 2@4", "Matrix 2@4", "Matrix 1@2"]);
  });

  it("[Instances] renaming an instance renames its instance blocks", () => {
    openEditor(twoMatricesXml);
    cy.get('g[data-id="n2"] .blocklyEditableField').first().click();
    cy.get(".blocklyHtmlInput").clear().type("Links{enter}");
    expectState(ids, ["Matrix 1@2", "Links@4", "Matrix 1@2", "Links@4"]);
  });

  it("[Instances] RGB LED blocks keep their port dropdown", () => {
    openEditor(
      wrap(
        "",
        `<block type="sensebox_ws2818_led" id="l1"><field name="Port">1</field></block>`,
      ),
    );
    cy.get('g[data-id="l1"] .blocklyDropdownField').should("be.visible");
  });

  it("[Instances] warns when a block has no instance or an unknown one", () => {
    openEditor(
      wrap(
        "",
        `<block type="sensebox_ws2812_matrix_clear" id="d1">
          <field name="Port">2</field>${matrixInst("x1", "Matrix 9")}
          <next><block type="sensebox_ws2812_matrix_fullcolor" id="d2">
            <field name="Port">2</field>
          </block></next>
        </block>`,
      ),
    );
    // d1: instance "Matrix 9" has no init block, d2: no instance plugged in
    cy.get('g[data-id="d1"] > .blocklyWarningIcon').should("exist");
    cy.get('g[data-id="d2"] > .blocklyWarningIcon').should("exist");
  });
});

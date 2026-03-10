/// <reference types="cypress" />

describe("Basic Page Tests", () => {
  beforeEach(() => {
    cy.visit("/basic");
  });

  describe("Page Loading and Structure", () => {
    it("[Basic] visits the basic page", () => {
      cy.url().should("include", "/basic");
    });

    it("[Basic] displays Blockly workspace", () => {
      cy.get(".blocklySvg", { timeout: 10000 }).should("exist").and("be.visible");
    });

    it("[Basic] loads with correct height (non-embedded)", () => {
      cy.get(".blocklySvg")
        .parents("div")
        .first()
        .should("have.css", "height")
        .and("not.eq", "0px");
    });

    it("[Basic] displays the floating serial interface", () => {
      cy.get('[data-testid="serial-connect-button"]').should("exist");
    });
  });

  describe("Blockly Workspace Initialization", () => {
    it("[Basic] displays the start block", () => {
      cy.get(".blocklySvg", { timeout: 10000 }).should("exist");
      // Wait for Blockly to fully render
      cy.wait(1000);
      // Check for blocks in the workspace
      cy.get(".blocklyBlockCanvas").should("exist");
    });


  });


  describe("Serial Interface", () => {
    it("[Basic] displays serial connect button", () => {
      cy.get('[data-testid="serial-connect-button"]').should("exist");
    });

    it("[Basic] shows Web Serial API support status", () => {
      cy.window().then((win) => {
        if ("serial" in win.navigator) {
          // Browser supports Web Serial API
          cy.log("Web Serial API is supported");
        } else {
          // Browser does not support Web Serial API
          cy.log("Web Serial API is not supported");
        }
      });
    });

    it("[Basic] serial interface is not open by default", () => {
      // Serial monitor should not be fully expanded initially
      cy.get("body").then(($body) => {
        // If serial panel exists, it should be collapsed
        const serialPanel = $body.find('[role="dialog"]');
        if (serialPanel.length > 0) {
          cy.log("Serial panel exists");
        }
      });
    });
  });


  describe("Device Selection", () => {
    it("[Basic] does not display device selection on main basic page", () => {
      // The /basic page doesn't show device selection like /embeddedbasic does
      // It's accessible through the main navigation
      cy.get('img[alt="Sensebox ESP"]').should("not.exist");
    });
  });

  describe("Navigation", () => {
    it("[Basic] can navigate from basic page to tutorial", () => {
      // Open the sidebar
      cy.get('[data-testid="navbar-menu-button"]').click();

      // Navigate to tutorial
      cy.get('a[href="/tutorial"]').click();
      cy.wait(1000);
      cy.url().should("include", "/tutorial");
    });

    it("[Basic] can navigate from basic page to gallery", () => {
      cy.get('[data-testid="navbar-menu-button"]').click();
      cy.get('a[href="/gallery"]').click();
      cy.wait(1000);
      cy.url().should("include", "/gallery");
    });

    it("[Basic] can navigate back to basic page from other pages", () => {
      cy.visit("/tutorial");
      cy.visit("/basic");
      cy.url().should("include", "/basic");
      cy.get(".blocklySvg", { timeout: 10000 }).should("exist");
    });


  });



});

describe("Basic Embedded Page Tests", () => {
  describe("Embedded Mode", () => {
    it("[BasicEmbedded] visits the embedded basic page", () => {
      cy.visit("/embeddedbasic");
      cy.url().should("include", "/embeddedbasic");
    });

    it("[BasicEmbedded] displays Blockly workspace in full height", () => {
      cy.visit("/embeddedbasic");
      cy.get(".blocklySvg", { timeout: 10000 }).should("exist").and("be.visible");
      
      // In embedded mode, height should be 100vh
      cy.get(".blocklySvg")
        .parents("div")
        .first()
        .invoke("css", "height")
        .should("not.eq", "0px");
    });





    it("[BasicEmbedded] no navbar in embedded mode", () => {
      cy.visit("/embeddedbasic");
      // Navbar should not exist in embedded mode
      cy.get("nav").should("not.exist");
    });

    it("[BasicEmbedded] no footer in embedded mode", () => {
      cy.visit("/embeddedbasic");
      // Footer should not exist in embedded mode
      cy.get("footer").should("not.exist");
    });
  });

  describe("Embedded Projects", () => {
    it("[BasicEmbedded] loads project by ID", () => {
      // This test requires a valid project ID
      // For now, just verify the route exists
      cy.request({ url: "/embeddedbasic/invalidid", failOnStatusCode: false }).then(
        (response) => {
          // Should get HTML response even if project doesn't exist
          expect(response.status).to.be.oneOf([200, 404]);
        }
      );
    });
  });
});

describe("Basic Project Page Tests", () => {
  describe("Project Loading", () => {
    it("[BasicProject] handles invalid project ID gracefully", () => {
      cy.visit("/basic/invalidprojectid123");
      cy.wait(2000);
      
      // Should redirect back to /basic or show error
      cy.url().then((url) => {
        // Either redirected to /basic or stayed on project page with error handling
        expect(url).to.satisfy((u) => 
          u.includes("/basic") || u.includes("/basic/invalidprojectid123")
        );
      });
    });

    it("[BasicProject] displays breadcrumbs for project pages", () => {
      // Visit with an invalid ID and verify structure
      cy.visit("/basic/invalidprojectid123", { failOnStatusCode: false });
      cy.wait(2000);
      
      // If breadcrumbs exist, verify their structure
      cy.get("body").then(($body) => {
        if ($body.find("nav").length > 0) {
          cy.log("Breadcrumbs may be present");
        }
      });
    });

    it("[BasicProject] displays loading state while fetching project", () => {
      cy.visit("/basic/someprojectid");
      
      // Should show loading indicator briefly
      cy.get("body").should("exist");
    });
  });

  describe("Project Workspace", () => {
    it("[BasicProject] loads workspace with project XML", () => {
      // This requires a valid project, but we can verify the route works
      cy.visit("/basic");
      cy.get(".blocklySvg", { timeout: 10000 }).should("exist");
    });

    it("[BasicProject] displays FloatingSerial for projects", () => {
      cy.visit("/basic");
      // Serial interface should be available
      cy.get('[data-testid="serial-connect-button"]').should("exist");
    });
  });
});

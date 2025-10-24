describe("End-to-End Tutorial Flow", () => {
  const timestamp = Date.now();
  const email = `testuser+${timestamp}@example.com`;
  const password = "SecurePass123!";
  const initialTitle = "Test123";
  const updatedTitle = "Test123 - Updated";
  const BACKEND_URL = "https://api.testing.sensebox.de";
  let userToken;
  let createdTutorialId = "";

  it("1. registers a new user", () => {
    cy.visit("/user/register");

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/user/register/success");

    // ✅ Prüfe deutschen Erfolgshinweis
    cy.contains("Konto erfolgreich erstellt!").should("be.visible");
  });

  it("2. logs in with the registered user", () => {
    cy.visit("/user/login");

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Prüfe, dass wir nicht mehr auf der Login-Seite sind
    cy.url().should("not.include", "/login");
  });

  it("3. navigates to /tutorial/builder", () => {
    cy.visit("/user/login");

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Prüfe, dass wir nicht mehr auf der Login-Seite sind
    cy.url().should("not.include", "/login");

    cy.visit("/tutorial/builder");

    cy.url().should("include", "/tutorial/builder");
  });

  it("4. creates a new tutorial via UI", () => {
    cy.visit("/user/login");

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Prüfe, dass wir nicht mehr auf der Login-Seite sind
    cy.url().should("not.include", "/login");
    cy.visit("/tutorial/builder");

    // Eingaben vornehmen
    cy.get("#tutorial-title").type(initialTitle);
    cy.get("#tutorial-subtitle").type("Test123");
    cy.get("#accordion_builder_advanced").click();

    cy.get('button[value="3"]').click();

    // ❗ Klicke auf den Speichern-Button
    cy.contains("button", "Tutorial speichern").click();

    // Warte auf Erfolgsmeldung
    cy.contains("Tutorial erfolgreich gespeichert!").should("be.visible");

    cy.get("button").contains("Zum Tutorial").click();

    cy.url().then((url) => {
      const match = url.match(/\/tutorial\/([a-f0-9]{24})/);
      if (match) {
        createdTutorialId = match[1];
      } else {
        throw new Error("Tutorial-ID nicht in URL gefunden");
      }
    });
  });

  it("5. views the created tutorial", () => {
    cy.visit(`/tutorial/${createdTutorialId}`);
    cy.url().should("include", `/tutorial/${createdTutorialId}`);
    cy.contains(initialTitle).should("be.visible");
  });

  it("6. edits the tutorial title and saves", () => {
    cy.visit("/user/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Prüfe, dass wir nicht mehr auf der Login-Seite sind
    cy.url().should("not.include", "/login");
    cy.visit("/tutorial");
    cy.get('img[alt="Sensebox ESP"]').click();
    cy.get(`#edit${createdTutorialId}`).click();
    cy.get("#tutorial-title").type(updatedTitle);
    cy.get("#accordion_builder_advanced").click();

    cy.get('button[value="1"]').click();

    cy.get(`#edit_hardware`).click();
    cy.get('img[alt="MCU-S2"]').click();
    cy.get('img[alt="Display"]').click();
    cy.get('img[alt="GPS"]').click();
    cy.get("button").contains("Fertig").click();
    cy.contains("button", "Tutorial speichern").click();

    // Warte auf Erfolgsmeldung
    cy.contains("Tutorial erfolgreich gespeichert!").should("be.visible");

    cy.get("button").contains("Zum Tutorial").click();

    // Optional: Prüfe auch im UI
    cy.contains(updatedTitle).should("be.visible");

    cy.contains("GPS").should("be.visible");
    cy.contains("Display").should("be.visible");
    cy.contains("MCU-S2").should("be.visible");
  });

  it("7. deletes the test tutorial", () => {
    cy.visit("/user/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Prüfe, dass wir nicht mehr auf der Login-Seite sind
    cy.url().should("not.include", "/login");
    cy.visit("/tutorial");
    cy.get('img[alt="Sensebox ESP"]').click();
    cy.get(`#delete${createdTutorialId}`).click();
    cy.get("#confirmDelete").click();
    // confirm delete button is gone
    cy.get("body").find(`#delete${createdTutorialId}`).should("not.exist");
  });

  it("8. deletes the test user account", () => {
    cy.request("POST", `${BACKEND_URL}/user/login`, {
      email,
      password,
    }).then((loginRes) => {
      const token = loginRes.body.token;

      // Nutzer löschen
      cy.request({
        method: "DELETE",
        url: `${BACKEND_URL}/user/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((deleteRes) => {
        expect(deleteRes.status).to.eq(200);
        expect(deleteRes.body.message).to.eq(
          "User account successfully deleted.",
        );
      });
    });
  });
});

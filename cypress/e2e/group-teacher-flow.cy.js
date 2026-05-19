/// <reference types="cypress" />

describe("Group Teacher POV Flow", () => {
  const groupId = "teacher-group-1";

  const visitPrivate = (path) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "fake-token");
      },
    });
  };

  beforeEach(() => {
    cy.intercept("GET", "**/user", {
      statusCode: 200,
      body: {
        user: {
          _id: "teacher-1",
          language: "de_DE",
          status: [],
        },
      },
    }).as("loadUser");
  });

  it("[Teacher] creates a group and lands on group dashboard", () => {
    cy.intercept("POST", "**/group", (req) => {
      expect(req.body.name).to.eq("Klasse 7A");
      req.reply({
        statusCode: 200,
        body: {
          group: {
            _id: groupId,
            name: "Klasse 7A",
            accessCode: "ABCD12",
          },
        },
      });
    }).as("createGroup");

    cy.intercept("GET", `**/group/getOne/${groupId}`, {
      statusCode: 200,
      body: {
        group: {
          _id: groupId,
          name: "Klasse 7A",
          accessCode: "ABCD12",
        },
      },
    });
    cy.intercept("GET", `**/group/dashboard/${groupId}`, {
      statusCode: 200,
      body: {},
    });
    cy.intercept("GET", `**/group/${groupId}/member/getAll`, {
      statusCode: 200,
      body: { members: [] },
    });

    visitPrivate("/group");

    cy.get('input[name="Gruppenname"]').type("Klasse 7A");
    cy.contains("button", "Neue Gruppe erstellen").click();

    cy.wait("@createGroup");
    cy.url().should("include", `/group/${groupId}`);
  });

  it("[Teacher] sees access code dialog on dashboard", () => {
    cy.intercept("GET", `**/group/getOne/${groupId}`, {
      statusCode: 200,
      body: {
        group: {
          _id: groupId,
          name: "Klasse 7A",
          accessCode: "ZXCV12",
        },
      },
    });
    cy.intercept("GET", `**/group/dashboard/${groupId}`, {
      statusCode: 200,
      body: {},
    });
    cy.intercept("GET", `**/group/${groupId}/member/getAll`, {
      statusCode: 200,
      body: { members: [] },
    });

    visitPrivate(`/group/${groupId}`);

    cy.contains("button", "Zugangscode anzeigen").click();
    cy.contains("Zugangscode für die Gruppe:").should("be.visible");
    cy.contains("ZXCV12").should("be.visible");
    cy.get("body").type("{esc}");
    cy.contains("Zugangscode für die Gruppe:").should("not.exist");
  });

  it("[Teacher] can open create-student page and add a student", () => {
    cy.intercept("GET", `**/group/getOne/${groupId}`, {
      statusCode: 200,
      body: {
        group: {
          _id: groupId,
          name: "Klasse 7A",
          accessCode: "ABCD12",
        },
      },
    });
    cy.intercept("GET", `**/group/dashboard/${groupId}`, {
      statusCode: 200,
      body: {},
    });
    cy.intercept("GET", `**/group/${groupId}/member/getAll`, {
      statusCode: 200,
      body: { members: [] },
    }).as("getMembers");

    cy.intercept("POST", `**/group/${groupId}/member/createStudent`, (req) => {
      expect(req.body).to.deep.equal({
        name: "Max Mustermann",
        nickname: "max",
      });
      req.reply({
        statusCode: 200,
        body: {
          message: "created",
          member: {
            _id: "member-2",
            name: "Max Mustermann",
            nickname: "max",
          },
        },
      });
    }).as("createStudent");

    visitPrivate(`/group/${groupId}`);
    cy.wait("@getMembers");

    cy.contains("button", "Hinzufügen").click();
    cy.url().should("include", `/createStudent/${groupId}`);

    cy.get('input[label="Name"], input').first().type("Max Mustermann");
    cy.get('input[label="Spitzname"], input').eq(1).type("max");
    cy.contains("button", "Hinzufügen").click();

    cy.wait("@createStudent");
    cy.url().should("include", `/group/${groupId}`);
  });

  it("[Teacher] can access archive page and delete group via icon", () => {
    const archivedGroupId = "archived-1";

    cy.intercept("GET", "**/group/getAll", {
      statusCode: 200,
      body: {
        groups: [
          {
            _id: archivedGroupId,
            name: "Alte Gruppe",
            archived: true,
          },
        ],
      },
    });

    cy.intercept("DELETE", `**/group/${archivedGroupId}/leave/delete`, {
      statusCode: 200,
      body: { message: "deleted" },
    }).as("deleteGroup");

    visitPrivate("/archiveGroup");

    cy.contains("Archivierte Gruppen").should("be.visible");
    cy.get('button[aria-label="Gruppe löschen"]').click();

    cy.wait("@deleteGroup");
    cy.contains("Alte Gruppe").should("not.exist");
  });
});

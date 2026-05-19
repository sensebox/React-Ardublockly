/// <reference types="cypress" />

describe("Group & Member Flow", () => {
  const groupId = "group123";
  const memberId = "member123";

  const visitApp = (path, { token } = {}) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.__REDUX_DEVTOOLS_EXTENSION__ =
          () =>
          (createStoreFn) =>
          (...args) =>
            createStoreFn(...args);
        if (token) {
          win.localStorage.setItem("token", token);
        }
      },
    });
  };

  const loginAsAuthenticatedUser = () => {
    cy.intercept("GET", "**/user", {
      statusCode: 200,
      body: {
        user: {
          _id: "user1",
          language: "de_DE",
          status: [],
        },
      },
    }).as("loadUser");
  };

  it("[JoinGroup] sends access code case-insensitive (normalized uppercase)", () => {
    cy.intercept("POST", "**/group/join", (req) => {
      expect(req.body.accessCode).to.eq("AB12CD");
      expect(req.body.nickname).to.eq("Tester");
      req.reply({
        statusCode: 200,
        body: {
          groupId,
          memberId,
        },
      });
    }).as("joinGroup");

    visitApp("/joinGroup");

    cy.get('input[name="Zugangscode"]').type("ab12cd");
    cy.get('input[name="Nickname"]').type("Tester");
    cy.contains("button", "Gruppe beitreten").click();

    cy.wait("@joinGroup");
  });

  it("[GroupDashboard] hides tutorial/progress after 1 minute offline", () => {
    const oldLastSeen = new Date(Date.now() - 2 * 60 * 1000).toISOString();

    loginAsAuthenticatedUser();

    cy.intercept("GET", `**/group/getOne/${groupId}`, {
      statusCode: 200,
      body: {
        group: {
          _id: groupId,
          accessCode: "ABC123",
        },
      },
    }).as("getGroup");

    cy.intercept("GET", `**/group/dashboard/${groupId}`, {
      statusCode: 200,
      body: {},
    }).as("getDashboard");

    cy.intercept("GET", `**/group/${groupId}/member/getAll`, {
      statusCode: 200,
      body: {
        members: [
          {
            _id: memberId,
            name: "Max Mustermann",
            nickname: "max",
            onlineStatus: false,
            lastSeen: oldLastSeen,
          },
        ],
      },
    }).as("getMembers");

    cy.intercept(
      "GET",
      `**/group/${groupId}/progress/getTutorialProgress/${memberId}`,
      {
        statusCode: 200,
        body: {
          tutorialTitle: "Blink Tutorial",
          currentStep: 2,
          totalSteps: 5,
        },
      },
    ).as("getProgress");

    visitApp(`/group/${groupId}`, { token: "fake-token" });

    cy.wait("@loadUser");
    cy.wait("@getGroup");
    cy.wait("@getDashboard");
    cy.wait("@getMembers");
    cy.wait("@getProgress");

    cy.contains("td", "Max Mustermann")
      .parents("tr")
      .within(() => {
        cy.get("td").eq(3).should("contain", "-");
        cy.get("td").eq(4).should("contain", "-");
      });
  });

  it("[MemberRouteGuard] auto-leaves and redirects when group is archived", () => {
    loginAsAuthenticatedUser();

    cy.intercept("GET", `**/group/getOne/${groupId}`, {
      statusCode: 200,
      body: {
        group: {
          _id: groupId,
          archived: true,
        },
      },
    }).as("getArchivedGroup");

    cy.intercept("PUT", `**/group/${groupId}/member/leave`, {
      statusCode: 200,
      body: { message: "left" },
    }).as("leaveGroup");

    cy.intercept("GET", `**/group/${groupId}/tutorial/getAllTutorials`, {
      statusCode: 200,
      body: { tutorials: [] },
    });

    cy.intercept("POST", `**/group/${groupId}/member/heartbeat/${memberId}`, {
      statusCode: 200,
      body: {},
    });

    visitApp(`/group/${groupId}/member/tutorials/${memberId}`, {
      token: "fake-token",
    });

    cy.wait("@loadUser");
    cy.wait("@getArchivedGroup");
    cy.wait("@leaveGroup");
    cy.url().should("include", "/joinGroup");
  });

  it("[GroupDashboard] archives group after removing all members", () => {
    loginAsAuthenticatedUser();

    const members = [
      { _id: "m1", name: "Member 1", nickname: "m1", onlineStatus: false },
      { _id: "m2", name: "Member 2", nickname: "m2", onlineStatus: true },
    ];

    cy.intercept("GET", `**/group/getOne/${groupId}`, {
      statusCode: 200,
      body: {
        group: {
          _id: groupId,
          accessCode: "ABC123",
        },
      },
    });

    cy.intercept("GET", `**/group/dashboard/${groupId}`, {
      statusCode: 200,
      body: {},
    });

    cy.intercept("GET", `**/group/${groupId}/member/getAll`, {
      statusCode: 200,
      body: { members },
    }).as("getMembers");

    cy.intercept("GET", `**/group/${groupId}/progress/getTutorialProgress/*`, {
      statusCode: 200,
      body: {},
    });

    cy.intercept("PUT", `**/group/${groupId}/member/leave`, {
      statusCode: 200,
      body: { ok: true },
    }).as("leaveMember");

    cy.intercept("PATCH", `**/group/${groupId}/archive`, {
      statusCode: 200,
      body: { archived: true },
    }).as("archiveGroup");

    visitApp(`/group/${groupId}`, { token: "fake-token" });

    cy.wait("@loadUser");
    cy.wait("@getMembers");

    cy.contains("button", "verlassen & archivieren").click();

    cy.wait("@archiveGroup");
    cy.get("@leaveMember.all").should("have.length", 2);
  });
});

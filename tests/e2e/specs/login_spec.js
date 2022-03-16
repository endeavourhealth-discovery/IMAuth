import {mount} from "@cypress/vue";
import Login from "../../../src/components/user/Login.vue";

describe("The Login page", () => {
  beforeEach(() => {
    // cy.visit('/');
    mount(Login, {})
    // cy.get(".p-button-label")
    //   .contains("Agree")
    //   .click();
    // cy.get("#user-icon").click();
    // cy.contains("Login").click();
  });

  it("accepts user input in fields", () => {
    cy.get("#fieldUsername")
      .type("fake@email.com")
      .should("have.value", "fake@email.com");
    cy.get("#fieldPassword")
      .type("incorrectPassword")
      .should("have.value", "incorrectPassword");
  });

  it("denies entry when invalid username is given", () => {
    cy.get("#fieldUsername").type("fake@email.com");
    cy.get("#fieldPassword").type("correctPassword");

    cy.get(".p-button-label")
    .contains("Login").click();
    cy.contains("Error");
    cy.contains("Login failed.");
  });

  it("denies entry when no username is given", () => {
    cy.get("#fieldPassword").type("correctPassword");

    cy.get(".p-button-label")
    .contains("Login").click();
    cy.contains("Error");
    cy.contains("Login failed.");
  });

  it("denies entry when invalid password is given", () => {
    cy.get("#fieldUsername").type("fake@email.com");
    cy.get("#fieldPassword").type("incorrectPassword");

    cy.get(".p-button-label")
    .contains("Login").click();
    cy.contains("Error");
    cy.contains("Login failed.");
  });

  it("denies entry when no password is given", () => {
    cy.get("#fieldUsername").type("fake@email.com");

    cy.get(".p-button-label")
    .contains("Login").click();
    cy.contains("Error");
    cy.contains("Login failed.");
  });
});

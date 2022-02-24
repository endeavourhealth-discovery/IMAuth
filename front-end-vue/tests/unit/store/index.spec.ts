import store from "@/store/index";
import { flushPromises } from "@vue/test-utils";
import LoggerService from "@/services/LoggerService";
import AuthService from "@/services/AuthService";
import { Models } from "im-library";
const { User, CustomAlert } = Models;

describe("state", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    window.sessionStorage.clear();
  });

  afterAll(() => {
    window.sessionStorage.clear();
  });

  it("should start with the correct values", () => {
    expect(Object.keys(store.state)).toStrictEqual(["currentUser", "registeredUsername", "isLoggedIn", "previousAppUrl"]);
    expect(store.state.currentUser).toEqual({});
    expect(store.state.registeredUsername).toBe("");
    expect(store.state.isLoggedIn).toBeFalsy();
    expect(store.state.previousAppUrl).toBe(null);
  });
});

describe("mutations", () => {
  it("can updateCurrentUser", () => {
    const testUser = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", "colour/003-man.png");
    store.commit("updateCurrentUser", testUser);
    expect(store.state.currentUser).toEqual(testUser);
  });

  it("can updateRegisteredUsername", () => {
    const testUsername = "devTest";
    store.commit("updateRegisteredUsername", "devTest");
    expect(store.state.registeredUsername).toBe(testUsername);
  });

  it("can updateIsLoggedIn", () => {
    const testBool = true;
    store.commit("updateIsLoggedIn", testBool);
    expect(store.state.isLoggedIn).toBe(true);
  });

  it("can updatePreviousAppUrl", () => {
    const url = "testUrl";
    store.commit("updatePreviousAppUrl", url);
    expect(store.state.previousAppUrl).toBe(url);
  });
});

describe("actions", () => {
  it("can logoutCurrentUser ___ 200", async () => {
    AuthService.signOut = jest.fn().mockResolvedValue(new CustomAlert(200, "logout successful"));
    LoggerService.error = jest.fn();
    let result = false;
    await store.dispatch("logoutCurrentUser").then(res => (result = res));
    await flushPromises();
    expect(AuthService.signOut).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.currentUser).toBe(null);
    expect(store.state.isLoggedIn).toBe(false);
    expect(result).toEqual(new CustomAlert(200, "logout successful"));
  });

  it("can logoutCurrentUser ___ 400", async () => {
    AuthService.signOut = jest.fn().mockResolvedValue(new CustomAlert(400, "logout failed 400"));
    LoggerService.error = jest.fn();
    let result = false;
    await store.dispatch("logoutCurrentUser").then(res => (result = res));
    await flushPromises();
    expect(AuthService.signOut).toBeCalledTimes(1);
    await flushPromises();
    expect(result).toEqual(new CustomAlert(400, "logout failed 400"));
  });

  it("can authenticateCurrentUser___ 200 ___ avatar", async () => {
    let testUser = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", "colour/003-man.png");
    testUser.setId("8901-test");
    AuthService.getCurrentAuthenticatedUser = jest.fn().mockResolvedValue(new CustomAlert(200, "user authenticated", undefined, testUser));
    let result = { authenticated: false };
    await store.dispatch("authenticateCurrentUser").then(res => (result = res));
    await flushPromises();
    expect(AuthService.getCurrentAuthenticatedUser).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.isLoggedIn).toBe(true);
    expect(store.state.currentUser).toEqual(testUser);
    expect(result.authenticated).toBe(true);
  });

  it("can authenticateCurrentUser___ 200 ___ no avatar", async () => {
    let testUser = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", "http://testimage.jpg");
    testUser.setId("8901-test");
    AuthService.getCurrentAuthenticatedUser = jest.fn().mockResolvedValue(new CustomAlert(200, "user authenticated", undefined, testUser));
    let result = { authenticated: false };
    await store.dispatch("authenticateCurrentUser").then(res => (result = res));
    await flushPromises();
    expect(AuthService.getCurrentAuthenticatedUser).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.isLoggedIn).toBe(true);
    testUser.avatar = "colour/001-man.png";
    expect(store.state.currentUser).toEqual(testUser);
    expect(result.authenticated).toBe(true);
  });

  it("can authenticateCurrentUser___ 403 ___ logout 200", async () => {
    AuthService.getCurrentAuthenticatedUser = jest.fn().mockResolvedValue(new CustomAlert(403, "user authenticated"));
    AuthService.signOut = jest.fn().mockResolvedValue(new CustomAlert(200, "logout successful"));
    LoggerService.info = jest.fn();
    let result = { authenticated: false };
    await store.dispatch("authenticateCurrentUser").then(res => (result = res));
    await flushPromises();
    expect(AuthService.getCurrentAuthenticatedUser).toBeCalledTimes(1);
    await flushPromises();
    expect(AuthService.signOut).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.isLoggedIn).toBe(false);
    expect(store.state.currentUser).toBe(null);
    expect(result.authenticated).toBe(false);
    expect(LoggerService.info).toBeCalledTimes(1);
    expect(LoggerService.info).toBeCalledWith(undefined, "Force logout successful");
  });

  it("can authenticateCurrentUser___ 403 ___ logout 200", async () => {
    AuthService.getCurrentAuthenticatedUser = jest.fn().mockResolvedValue(new CustomAlert(403, "user authenticated"));
    AuthService.signOut = jest.fn().mockResolvedValue(new CustomAlert(400, "logout failed"));
    LoggerService.error = jest.fn();
    let result = { authenticated: false };
    await store.dispatch("authenticateCurrentUser").then(res => (result = res));
    await flushPromises();
    expect(AuthService.getCurrentAuthenticatedUser).toBeCalledTimes(1);
    await flushPromises();
    expect(AuthService.signOut).toBeCalledTimes(1);
    await flushPromises();
    expect(store.state.isLoggedIn).toBe(false);
    expect(store.state.currentUser).toBe(null);
    expect(result.authenticated).toBe(false);
    expect(LoggerService.error).toBeCalledTimes(1);
    expect(LoggerService.error).toBeCalledWith(undefined, "Force logout failed");
  });
});

import { flushPromises } from "@vue/test-utils";
import { Auth } from "aws-amplify";
import AuthService from "@/services/AuthService";
import { Models } from "im-library";
const {User, CustomAlert} = Models

const testUser = new User("devtest", "John", "Doe", "john.doe@ergosoft.co.uk", "12345678", "colour/002-man.png");

describe("register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 with auth success", async () => {
    Auth.signUp = vi.fn().mockResolvedValue({ status: 200, message: "test confirm code" });
    const result = AuthService.register(testUser);
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.signUp).toHaveBeenCalledTimes(1);
    expect(Auth.signUp).toHaveBeenCalledWith({
      username: "devtest",
      password: "12345678",
      attributes: { email: "john.doe@ergosoft.co.uk", "custom:forename": "John", "custom:surname": "Doe", "custom:avatar": "colour/002-man.png" }
    });
    expect(promiseResult).toStrictEqual(new CustomAlert(201, "User registered successfully"));
  });

  it("returns 409 with auth fail ___ username exists", async () => {
    Auth.signUp = vi.fn().mockRejectedValue({ code: "UsernameExistsException", name: "testError", message: "User already exists" });
    const result = AuthService.register(testUser);
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.signUp).toHaveBeenCalledTimes(1);
    expect(Auth.signUp).toHaveBeenCalledWith({
      username: "devtest",
      password: "12345678",
      attributes: { email: "john.doe@ergosoft.co.uk", "custom:forename": "John", "custom:surname": "Doe", "custom:avatar": "colour/002-man.png" }
    });
    expect(promiseResult).toStrictEqual(new CustomAlert(409, "Username already exists", err));
  });

  it("returns 400 with auth fail ___ fail", async () => {
    Auth.signUp = vi.fn().mockRejectedValue("test");
    const result = AuthService.register(testUser);
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.signUp).toHaveBeenCalledTimes(1);
    expect(Auth.signUp).toHaveBeenCalledWith({
      username: "devtest",
      password: "12345678",
      attributes: { email: "john.doe@ergosoft.co.uk", "custom:forename": "John", "custom:surname": "Doe", "custom:avatar": "colour/002-man.png" }
    });
    expect(promiseResult).toStrictEqual(new CustomAlert(400, "User registration failed", err));
  });
});

describe("confirmRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success", async () => {
    Auth.confirmSignUp = vi.fn().mockResolvedValue({ status: 200, message: "test confirm code" });
    const result = AuthService.confirmRegister("devtest", "123456");
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.confirmSignUp).toHaveBeenCalledTimes(1);
    expect(Auth.confirmSignUp).toHaveBeenCalledWith("devtest", "123456");
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "Register confirmation successful"));
  });

  it("returns 403 with auth fail", async () => {
    Auth.confirmSignUp = vi.fn().mockRejectedValue({ code: "TestErrorCode", name: "testError", message: "CodeRejected" });
    const result = AuthService.confirmRegister("devtest", "123456");
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.confirmSignUp).toHaveBeenCalledTimes(1);
    expect(Auth.confirmSignUp).toHaveBeenCalledWith("devtest", "123456");
    expect(promiseResult).toStrictEqual(new CustomAlert(403, "Failed register confirmation", err));
  });
});

describe("signIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success, password empty, id set", async () => {
    Auth.signIn = vi.fn().mockResolvedValue({
      username: "devtest",
      attributes: {
        "custom:avatar": "colour/002-man.png",
        "custom:forename": "John",
        "custom:surname": "Doe",
        email: "john.doe@ergosoft.co.uk",
        email_verified: true,
        sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
      }
    });
    const result = AuthService.signIn("devTest", "12345678");
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    testUser.setId("9gkej864-l39k-9u87-4lau-w7777b3m5g09");
    testUser.password = "";
    expect(Auth.signIn).toHaveBeenCalledTimes(1);
    expect(Auth.signIn).toHaveBeenCalledWith("devTest", "12345678");
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "Login successful", undefined, testUser));
  });

  it("returns 401 with auth fail ___ user not confirmed", async () => {
    Auth.signIn = vi.fn().mockRejectedValue({ code: "UserNotConfirmedException", name: "testError", message: "User not confirmed test" });
    const result = AuthService.signIn("devTest", "12345678");
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.signIn).toHaveBeenCalledTimes(1);
    expect(Auth.signIn).toHaveBeenCalledWith("devTest", "12345678");
    expect(promiseResult).toStrictEqual(new CustomAlert(401, "User not confirmed test", err));
  });

  it("returns 403 with auth fail ___ login failed", async () => {
    Auth.signIn = vi.fn().mockRejectedValue({ code: "LoginError", name: "testError", message: "Login error test" });
    const result = AuthService.signIn("devTest", "12345678");
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.signIn).toHaveBeenCalledTimes(1);
    expect(Auth.signIn).toHaveBeenCalledWith("devTest", "12345678");
    expect(promiseResult).toStrictEqual(new CustomAlert(403, "Login failed. Check username and password are correct", err));
  });
});

describe("resendConfirmationCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success", async () => {
    Auth.resendSignUp = vi.fn().mockResolvedValue({ code: 200 });
    const result = AuthService.resendConfirmationCode("devTest");
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.resendSignUp).toHaveBeenCalledTimes(1);
    expect(Auth.resendSignUp).toHaveBeenCalledWith("devTest");
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "Code resent successfully"));
  });

  it("returns 400 with auth fail", async () => {
    Auth.resendSignUp = vi.fn().mockRejectedValue({ code: "Resend", name: "testError", message: "Resend error test" });
    const result = AuthService.resendConfirmationCode("devTest");
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.resendSignUp).toHaveBeenCalledTimes(1);
    expect(Auth.resendSignUp).toHaveBeenCalledWith("devTest");
    expect(promiseResult).toStrictEqual(new CustomAlert(400, "Error resending code", err));
  });
});

describe("signOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success", async () => {
    Auth.signOut = vi.fn().mockResolvedValue({ code: 200 });
    const result = AuthService.signOut();
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.signOut).toHaveBeenCalledTimes(1);
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "Logged out successfully"));
  });

  it("returns 400 with auth fail", async () => {
    Auth.signOut = vi.fn().mockRejectedValue({ code: "Logout", name: "testError", message: "Logout error test" });
    const result = AuthService.signOut();
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.signOut).toHaveBeenCalledTimes(1);
    expect(promiseResult).toStrictEqual(new CustomAlert(400, "Error logging out from auth server", err));
  });
});

describe("updateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success, id remains same, password returns empty", async () => {
    Auth.currentAuthenticatedUser = vi
      .fn()
      .mockResolvedValueOnce({
        username: "devtest",
        attributes: {
          "custom:avatar": "colour/002-man.png",
          "custom:forename": "John",
          "custom:surname": "Doe",
          email: "john.doe@ergosoft.co.uk",
          email_verified: true,
          sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
        }
      })
      .mockResolvedValueOnce({
        username: "devtestupdated",
        attributes: {
          "custom:avatar": "colour/003-man.png",
          "custom:forename": "Bill",
          "custom:surname": "Williams",
          email: "bill.williams@ergosoft.co.uk",
          email_verified: true,
          sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
        }
      });
    Auth.updateUserAttributes = vi.fn().mockResolvedValue({ code: "UpdateUser", name: "updatesuccess", message: "User updated" });
    const updatedUser = new User("devtestupdated", "Bill", "Williams", "bill.williams@ergosoft.co.uk", "87654321", "colour/003-man.png");
    updatedUser.setId("9gkej864-l39k-9u87-4lau-w7777b3m5g09");
    const result = AuthService.updateUser(updatedUser);
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalledTimes(2);
    expect(Auth.updateUserAttributes).toHaveBeenCalledTimes(1);
    expect(Auth.updateUserAttributes).toHaveBeenCalledWith(
      {
        username: "devtest",
        attributes: {
          "custom:avatar": "colour/002-man.png",
          "custom:forename": "John",
          "custom:surname": "Doe",
          email: "john.doe@ergosoft.co.uk",
          email_verified: true,
          sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
        }
      },
      {
        "custom:avatar": "colour/003-man.png",
        "custom:forename": "Bill",
        "custom:surname": "Williams",
        email: "bill.williams@ergosoft.co.uk"
      }
    );
    updatedUser.password = "";
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "User updated successfully", undefined, updatedUser));
  });

  it("returns 403 with auth fail, ids differ", async () => {
    Auth.currentAuthenticatedUser = vi
      .fn()
      .mockResolvedValueOnce({
        username: "devtest",
        attributes: {
          "custom:avatar": "colour/002-man.png",
          "custom:forename": "John",
          "custom:surname": "Doe",
          email: "john.doe@ergosoft.co.uk",
          email_verified: true,
          sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
        }
      })
      .mockResolvedValueOnce({
        username: "devtestupdated",
        attributes: {
          "custom:avatar": "colour/003-man.png",
          "custom:forename": "Bill",
          "custom:surname": "Williams",
          email: "bill.williams@ergosoft.co.uk",
          email_verified: true,
          sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
        }
      });
    Auth.updateUserAttributes = vi.fn().mockResolvedValue({ code: "UpdateUser", name: "updatesuccess", message: "User updated" });
    const updatedUser = new User("devtestupdated", "Bill", "Williams", "bill.williams@ergosoft.co.uk", "87654321", "colour/003-man.png");
    updatedUser.setId("9gkej864-l39k-9u87-4lau-w7777b3m5g08");
    const result = AuthService.updateUser(updatedUser);
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalledTimes(1);
    expect(Auth.updateUserAttributes).toHaveBeenCalledTimes(0);
    expect(promiseResult).toStrictEqual(new CustomAlert(403, "Authentication error with server", err));
  });

  it("returns 500 with auth fail", async () => {
    Auth.currentAuthenticatedUser = vi.fn().mockRejectedValue(false);
    Auth.updateUserAttributes = vi.fn().mockRejectedValue(false);
    const updatedUser = new User("devtestupdated", "Bill", "Williams", "bill.williams@ergosoft.co.uk", "87654321", "colour/003-man.png");
    updatedUser.setId("9gkej864-l39k-9u87-4lau-w7777b3m5g08");
    const result = AuthService.updateUser(updatedUser);
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalledTimes(1);
    expect(Auth.updateUserAttributes).toHaveBeenCalledTimes(0);
    expect(promiseResult).toStrictEqual(new CustomAlert(500, "Error authenticating current user", err));
  });
});

describe("changePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success", async () => {
    Auth.currentAuthenticatedUser = vi.fn().mockResolvedValueOnce({
      username: "devtest",
      attributes: {
        "custom:avatar": "colour/002-man.png",
        "custom:forename": "John",
        "custom:surname": "Doe",
        email: "john.doe@ergosoft.co.uk",
        email_verified: true,
        sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
      }
    });
    Auth.changePassword = vi.fn().mockResolvedValue({ code: 200 });
    const result = AuthService.changePassword("12345678", "87654321");
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalledTimes(1);
    expect(Auth.changePassword).toHaveBeenCalledTimes(1);
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "Password successfully changed"));
  });

  it("returns 400 with auth fail", async () => {
    Auth.currentAuthenticatedUser = vi.fn().mockResolvedValueOnce({
      username: "devtest",
      attributes: {
        "custom:avatar": "colour/002-man.png",
        "custom:forename": "John",
        "custom:surname": "Doe",
        email: "john.doe@ergosoft.co.uk",
        email_verified: true,
        sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
      }
    });
    Auth.changePassword = vi.fn().mockRejectedValue({ code: "passwordChangeError", message: "Password change error" });
    const result = AuthService.changePassword("12345678", "87654321");
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalledTimes(1);
    expect(Auth.changePassword).toHaveBeenCalledTimes(1);
    expect(promiseResult).toStrictEqual(new CustomAlert(400, "Password change error", err));
  });
});

describe("forgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success", async () => {
    Auth.forgotPassword = vi.fn().mockResolvedValue({ code: 200 });
    const result = AuthService.forgotPassword("devtest");
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.forgotPassword).toHaveBeenCalledTimes(1);
    expect(Auth.forgotPassword).toHaveBeenCalledWith("devtest");
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "Password reset request sent to server"));
  });

  it("returns 400 with auth fail ___ fail", async () => {
    Auth.forgotPassword = vi.fn().mockRejectedValue({ code: "PasswordResetFail", message: "Password reset error" });
    const result = AuthService.forgotPassword("devtest");
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.forgotPassword).toHaveBeenCalledTimes(1);
    expect(Auth.forgotPassword).toHaveBeenCalledWith("devtest");
    expect(promiseResult).toStrictEqual(new CustomAlert(400, "Error resetting password from server", err));
  });
});

describe("forgotPasswordSubmit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success", async () => {
    Auth.forgotPasswordSubmit = vi.fn().mockResolvedValue({ code: 200 });
    const result = AuthService.forgotPasswordSubmit("devtest", "123456", "87654321");
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.forgotPasswordSubmit).toHaveBeenCalledTimes(1);
    expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith("devtest", "123456", "87654321");
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "Password reset successfully"));
  });

  it("returns 400 with auth fail ___ fail", async () => {
    Auth.forgotPasswordSubmit = vi.fn().mockRejectedValue({ code: "PasswordResetCodeFail", message: "Password reset code error" });
    const result = AuthService.forgotPasswordSubmit("devtest", "123456", "87654321");
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.forgotPasswordSubmit).toHaveBeenCalledTimes(1);
    expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith("devtest", "123456", "87654321");
    expect(promiseResult).toStrictEqual(new CustomAlert(400, "Error submitting password-reset credentials", err));
  });

  it("returns 403 with auth fail ___ expired", async () => {
    Auth.forgotPasswordSubmit = vi.fn().mockRejectedValue({ code: "ExpiredCodeException", message: "Password reset error" });
    const result = AuthService.forgotPasswordSubmit("devtest", "123456", "87654321");
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.forgotPasswordSubmit).toHaveBeenCalledTimes(1);
    expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith("devtest", "123456", "87654321");
    expect(promiseResult).toStrictEqual(new CustomAlert(403, "Code has expired", err));
  });
});

describe("forgotUsername", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success", async () => {
    Auth.verifyCurrentUserAttribute = vi.fn().mockResolvedValue({ code: 200 });
    const result = AuthService.forgotUsername("john.doe@ergosoft.co.uk");
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.verifyCurrentUserAttribute).toHaveBeenCalledTimes(1);
    expect(Auth.verifyCurrentUserAttribute).toHaveBeenCalledWith("john.doe@ergosoft.co.uk");
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "Account recovery code sent"));
  });

  it("returns 400 with auth fail ___ fail", async () => {
    Auth.verifyCurrentUserAttribute = vi.fn().mockRejectedValue({ code: "UsernameRecoveryFail", message: "Username recovery error" });
    const result = AuthService.forgotUsername("john.doe@ergosoft.co.uk");
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.verifyCurrentUserAttribute).toHaveBeenCalledTimes(1);
    expect(Auth.verifyCurrentUserAttribute).toHaveBeenCalledWith("john.doe@ergosoft.co.uk");
    expect(promiseResult).toStrictEqual(new CustomAlert(400, "Error submitting email", err));
  });
});

describe("getCurrentAuthenticatedUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with auth success, user, password empty, with id", async () => {
    Auth.currentAuthenticatedUser = vi.fn().mockResolvedValueOnce({
      username: "devtest",
      attributes: {
        "custom:avatar": "colour/002-man.png",
        "custom:forename": "John",
        "custom:surname": "Doe",
        email: "john.doe@ergosoft.co.uk",
        email_verified: true,
        sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
      }
    });
    const result = AuthService.getCurrentAuthenticatedUser();
    let promiseResult;
    result.then(res => {
      promiseResult = res;
    });
    await flushPromises();
    const currentUser = new User("devtest", "John", "Doe", "john.doe@ergosoft.co.uk", "", "colour/002-man.png");
    currentUser.setId("9gkej864-l39k-9u87-4lau-w7777b3m5g09");
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalledTimes(1);
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "User authenticated successfully", undefined, currentUser));
  });

  it("returns 400 with auth fail", async () => {
    Auth.currentAuthenticatedUser = vi.fn().mockRejectedValue({ code: "currentUserFail", message: "get current user error" });
    const result = AuthService.getCurrentAuthenticatedUser();
    let promiseResult;
    let err;
    result.then(res => {
      err = res.error;
      promiseResult = res;
    });
    await flushPromises();
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalledTimes(1);
    expect(promiseResult).toStrictEqual(new CustomAlert(403, "Error authenticating current user", err));
  });
});

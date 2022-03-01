import { mount, flushPromises } from "@vue/test-utils";
import Login from "@/components/user/Login.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import AuthService from "@/services/AuthService";
import { Models } from "im-library";
const { User } = Models;

describe("login.vue no registeredUser", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockSwal: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      state: { registeredUsername: "" },
      commit: vi.fn()
    };
    mockRouter = {
      push: vi.fn(),
      go: vi.fn()
    };
    mockSwal = {
      fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
    };
    wrapper = mount(Login, {
      global: {
        components: { Card, Button, InputText },
        mocks: { $store: mockStore, $router: mockRouter, $swal: mockSwal }
      }
    });
  });

  it("starts empty if no store registeredUsername", async () => {
    const userNameField = wrapper.find("#fieldUsername");
    const userNameInput = userNameField.element as HTMLInputElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("fieldUsername");
    expect(userNameInput.value).toBe("");
  });
});

describe("login.vue with registeredUser", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockSwal: any;
  let testUser: Models.User;

  beforeEach(() => {
    vi.clearAllMocks();
    testUser = new User("devtest", "John", "Doe", "john.doe@ergosoft.co.uk", "", "colour/001-man.png");

    testUser.setId("9gkej864-l39k-9u87-4lau-w7777b3m5g09");

    AuthService.signIn = vi.fn().mockResolvedValue({ status: 200, message: "Login successful", user: testUser });

    mockStore = {
      state: { registeredUsername: "testUser" },
      commit: vi.fn()
    };
    mockRouter = {
      push: vi.fn(),
      go: vi.fn()
    };
    mockSwal = {
      fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
    };
    wrapper = mount(Login, {
      global: {
        components: { Card, Button, InputText },
        mocks: { $store: mockStore, $router: mockRouter, $swal: mockSwal }
      }
    });
  });

  it("starts with registeredUsername if in store", async () => {
    const userNameField = wrapper.find("#fieldUsername");
    const userNameInput = userNameField.element as HTMLInputElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("fieldUsername");
    expect(userNameInput.value).toBe("testUser");
  });

  it("hits the Authservice on handleSubmit", async () => {
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    expect(AuthService.signIn).toBeCalledTimes(1);
    expect(AuthService.signIn).toBeCalledWith("Devtest", "12345678");
  });

  it("updates the store on successful login", async () => {
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    expect(AuthService.signIn).toHaveReturned();
    await flushPromises();
    expect(mockStore.commit).toHaveBeenCalledTimes(3);
    expect(mockStore.commit.mock.calls).toEqual([
      [
        "updateCurrentUser",
        {
          avatar: "colour/001-man.png",
          email: "john.doe@ergosoft.co.uk",
          firstName: "John",
          id: "9gkej864-l39k-9u87-4lau-w7777b3m5g09",
          lastName: "Doe",
          password: "",
          username: "devtest"
        }
      ],
      ["updateRegisteredUsername", null],
      ["updateIsLoggedIn", true]
    ]);
  });

  it("checks for existing avatar and sets user avatar ___ true", async () => {
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockStore.commit).toBeCalledWith("updateCurrentUser", testUser);
  });

  it("checks for existing avatar and sets user avatar ___ false", async () => {
    const legacyUser = { username: "legacy", avatar: "image.jpg" };
    AuthService.signIn = vi.fn().mockResolvedValue({ status: 200, message: "Login successful", user: legacyUser });
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateCurrentUser", { username: "legacy", avatar: "colour/001-man.png" });
  });

  it("fires swal on auth success", async () => {
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(wrapper.vm.$swal.fire).toBeCalledTimes(1);
    expect(wrapper.vm.$swal.fire).toBeCalledWith({ icon: "success", title: "Success", text: "Login successful" });
  });

  it("reroutes on auth success", async () => {
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith({ name: "UserDetails" });
  });

  it("fires swal on auth error ___ 401", async () => {
    AuthService.signIn = vi.fn().mockResolvedValue({ status: 401, message: "Login successful", user: testUser });
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(wrapper.vm.$swal.fire).toBeCalledTimes(1);
    expect(wrapper.vm.$swal.fire).toBeCalledWith({
      icon: "warning",
      title: "User Unconfirmed",
      text: "Account has not been confirmed. Please confirm account to continue.",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirm Account"
    });
  });

  it("updates store and reroutes on auth error ___ 401", async () => {
    AuthService.signIn = vi.fn().mockResolvedValue({ status: 401, message: "Login successful", user: testUser });
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockStore.commit).toBeCalledTimes(1);
    expect(mockStore.commit).toBeCalledWith("updateRegisteredUsername", "Devtest");
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith({ name: "ConfirmCode" });
  });

  it("doesn't update store and reroutes on auth error, swal cancelled ___ 401", async () => {
    AuthService.signIn = vi.fn().mockResolvedValue({ status: 401, message: "Login successful", user: testUser });
    wrapper.vm.$swal.fire = vi.fn().mockImplementation(() => Promise.resolve({ isConfirmed: false }));
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockStore.commit).toBeCalledTimes(0);
    expect(mockRouter.push).toBeCalledTimes(0);
  });

  it("fires swal on auth error ___ other", async () => {
    AuthService.signIn = vi.fn().mockResolvedValue({ status: 400, message: "Login failed", user: testUser });
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(wrapper.vm.$swal.fire).toBeCalledTimes(1);
    expect(wrapper.vm.$swal.fire).toBeCalledWith({ icon: "error", title: "Error", text: "Login failed", confirmButtonText: "Close" });
  });

  it("fires swal on authservice error", async () => {
    console.error = vi.fn();
    AuthService.signIn = vi.fn().mockRejectedValue({ status: 400, message: "Login failed", error: "deliberate test error" });
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(wrapper.vm.$swal.fire).toBeCalledTimes(1);
    expect(wrapper.vm.$swal.fire).toBeCalledWith({ icon: "error", title: "Error", text: "Authentication error", confirmButtonText: "Close" });
  });

  it("can check a keycode ___ correct", async () => {
    wrapper.vm.checkKey({ keyCode: 13 });
    await wrapper.vm.$nextTick();
    expect(AuthService.signIn).toBeCalledTimes(1);
  });

  it("can check a keycode ___ incorrect", async () => {
    wrapper.vm.checkKey({ keyCode: 12 });
    await wrapper.vm.$nextTick();
    expect(AuthService.signIn).toBeCalledTimes(0);
  });
});

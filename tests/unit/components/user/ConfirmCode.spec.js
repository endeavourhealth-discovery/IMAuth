import Card from "primevue/card";
import Button from "primevue/button";
import { mount, flushPromises } from "@vue/test-utils";
import ConfirmCode from "@/components/user/ConfirmCode.vue";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import AuthService from "@/services/AuthService";

describe("ConfirmCode.vue no registeredUser", () => {
  let wrapper;
  let mockStore;
  let mockSwal;

  it("starts empty if no store registeredUsername", async () => {
    mockSwal = {
      fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
    };
    mockStore = {
      state: { registeredUsername: "" },
      commit: vi.fn()
    };
    wrapper = mount(ConfirmCode, {
      global: {
        components: { Card, Button, InputText, Dialog },
        mocks: { $store: mockStore, $swal: mockSwal }
      }
    });
    const userNameField = wrapper.find("#fieldUsername");
    const userNameInput = userNameField.element;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.username).toBe("");
    expect(wrapper.vm.code).toBe("");
    expect(wrapper.vm.codeVerified).toBe(false);
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("fieldUsername");
    expect(userNameInput.value).toBe("");
  });
});

describe("ConfirmCode.vue with registeredUser", () => {
  let wrapper;
  let mockStore;
  let mockRouter;
  let mockSwal;

  beforeEach(() => {
    vi.clearAllMocks();

    AuthService.confirmRegister = vi.fn().mockResolvedValue({ status: 200, message: "Register confirmation successful" });

    AuthService.resendConfirmationCode = vi.fn().mockResolvedValue({ status: 200, message: "Resend confirmation code successful" });

    mockSwal = {
      fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
    };
    mockStore = {
      state: { registeredUsername: "testUser" },
      commit: vi.fn()
    };
    mockRouter = {
      push: vi.fn(),
      go: vi.fn()
    };
    wrapper = mount(ConfirmCode, {
      global: {
        components: { Card, Button, InputText, Dialog },
        mocks: { $store: mockStore, $router: mockRouter, $swal: mockSwal }
      }
    });
  });

  it("fetches the store registeredUsername if present on mount", async () => {
    expect(wrapper.vm.username).toBe("testUser");
  });

  it("renders username when set", async () => {
    // Assert the rendered text of the component
    const userNameField = wrapper.find("#fieldUsername");
    const userNameInput = userNameField.element;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("fieldUsername");
    expect(userNameInput.value).toBe("testUser");
  });

  it("updates Username when edited", async () => {
    wrapper.vm.username = "John";
    const userNameField = wrapper.find("#fieldUsername");
    const userNameInput = userNameField.element;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("fieldUsername");
    expect(userNameInput.value).toBe("John");
  });

  it("updates Code when edited", async () => {
    wrapper.vm.code = "123456";
    const code = wrapper.find("#fieldCode");
    const codeInput = code.element;
    await wrapper.vm.$nextTick();
    expect(code.exists()).toBe(true);
    expect(code.element.id).toBe("fieldCode");
    expect(codeInput.value).toBe("123456");
  });

  it("can check if a code is invalid", async () => {
    wrapper.vm.code = "1234";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.codeVerified).toBe(false);
  });

  it("can check if a code is valid", async () => {
    wrapper.vm.code = "123456";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.codeVerified).toBe(true);
  });

  it("calls the Auth.ConfirmSignUp method on handle submit", async () => {
    wrapper.vm.code = "123456";
    await wrapper.vm.$nextTick();
    wrapper.vm.handleSubmit();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(AuthService.confirmRegister).toBeCalledTimes(1);
    expect(AuthService.confirmRegister).toBeCalledWith("testUser", "123456");
  });

  it("opens swal on correct username/code", async () => {
    wrapper.vm.code = "123456";
    await wrapper.vm.$nextTick;
    wrapper.vm.handleSubmit();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockSwal.fire).toBeCalledTimes(1);
    expect(mockSwal.fire).toBeCalledWith({ icon: "success", title: "Success", text: "Register confirmation successful", confirmButtonText: "Login" });
  });

  it("updates the store on correct username/code and re-routes", async () => {
    wrapper.vm.code = "123456";
    await wrapper.vm.$nextTick;
    wrapper.vm.handleSubmit();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toBeCalledTimes(1);
    expect(mockStore.commit).toBeCalledWith("updateRegisteredUsername", "testUser");
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith({ name: "Login" });
  });

  it("opens swal on incorrect username/code", async () => {
    wrapper.vm.code = "1234";
    await wrapper.vm.$nextTick;
    wrapper.vm.handleSubmit();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockSwal.fire).toBeCalledTimes(1);
    expect(mockSwal.fire).toBeCalledWith({ icon: "warning", title: "Invalid Credentials", text: "Username or Confirmation Code incorrect." });
  });

  it("opens swal on authservice fail", async () => {
    console.error = vi.fn();
    AuthService.confirmRegister = vi.fn().mockRejectedValue({ status: 403, message: "Failed register confirmation", error: "deliberate test error" });
    // Auth.confirmSignUp = vi.fn().mockRejectedValue({ status: 403, message: "test"});
    wrapper.vm.code = "123456";
    await wrapper.vm.$nextTick;
    wrapper.vm.handleSubmit();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockSwal.fire).toBeCalledTimes(1);
    expect(mockSwal.fire).toBeCalledWith({ icon: "error", title: "Error", text: "Auth Service Error" });
  });

  it("opens swal on auth code fail", async () => {
    console.error = vi.fn();
    AuthService.confirmRegister = vi.fn().mockResolvedValue({ status: 403, message: "Failed register confirmation", error: "deliberate test error" });
    // Auth.confirmSignUp = vi.fn().mockRejectedValue({ status: 403, message: "test"});
    wrapper.vm.code = "123456";
    await wrapper.vm.$nextTick;
    wrapper.vm.handleSubmit();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockSwal.fire).toBeCalledTimes(1);
    expect(mockSwal.fire).toBeCalledWith({ icon: "error", title: "Error", text: "Failed register confirmation" });
  });

  it("calls authservice on requestCode function run", async () => {
    wrapper.vm.requestCode(wrapper.vm.username);
    await wrapper.vm.$nextTick();
    expect(AuthService.resendConfirmationCode).toBeCalledTimes(1);
    expect(AuthService.resendConfirmationCode).toBeCalledWith("testUser");
  });

  it("fires swal with successful resend of code", async () => {
    wrapper.vm.requestCode(wrapper.vm.username);
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockSwal.fire).toBeCalledTimes(1);
    expect(mockSwal.fire).toBeCalledWith({ icon: "success", title: "Success", text: "Code has been resent to email for: testUser" });
  });

  it("fires swal with failed resend of code ___ auth status incorrect", async () => {
    console.error = vi.fn();
    AuthService.resendConfirmationCode = vi.fn().mockResolvedValue({ status: 403, message: "Failed code resend", error: "deliberate test error" });
    wrapper.vm.requestCode(wrapper.vm.username);
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockSwal.fire).toBeCalledTimes(1);
    expect(mockSwal.fire).toBeCalledWith({ icon: "error", title: "Error", text: "Code resending failed. Please check your username is correct." });
  });

  it("fires swal with failed resend of code ___ auth error", async () => {
    console.error = vi.fn();
    AuthService.resendConfirmationCode = vi.fn().mockRejectedValue({ status: 403, message: "Failed code resend", error: "deliberate test error" });
    wrapper.vm.requestCode(wrapper.vm.username);
    await flushPromises();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockSwal.fire).toBeCalledTimes(1);
    expect(mockSwal.fire).toBeCalledWith({ icon: "error", title: "Error", text: "Internal application error" });
  });
});

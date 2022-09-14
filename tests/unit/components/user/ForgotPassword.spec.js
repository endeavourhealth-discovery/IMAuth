import Card from "primevue/card";
import Button from "primevue/button";
import { mount, flushPromises } from "@vue/test-utils";
import ForgotPassword from "@/components/user/ForgotPassword.vue";
import InputText from "primevue/inputtext";
import AuthService from "@/services/AuthService";

const mockDispatch = vi.fn();
const mockState = { registeredUsername: "" };
const mockCommit = vi.fn();

vi.mock("vuex", () => ({
  useStore: () => ({
    dispatch: mockDispatch,
    state: mockState,
    commit: mockCommit
  })
}));

const mockPush = vi.fn();
const mockGo = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
    go: mockGo
  })
}));

// vi.mock("sweetalert2", () => {
//   return {
//     default: { fire: vi.fn() }
//   };
// });

describe("ForgotPassword.vue", () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    AuthService.forgotPassword = vi.fn().mockResolvedValue({ status: 200, message: "Password reset successful" });

    wrapper = mount(ForgotPassword, {
      global: {
        components: { Card, Button, InputText }
      }
    });
    wrapper.vm.username = "testUser";
  });

  it("updates username on user entry", async () => {
    const userNameField = wrapper.find("#fieldUsername");
    const userNameInput = userNameField.element;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("fieldUsername");
    expect(userNameInput.value).toBe("testUser");
  });

  // it("fires swal before auth service call", async () => {
  //   wrapper.vm.handleSubmit();
  //   await wrapper.vm.$nextTick();
  //   expect(mockSwal.fire).toBeCalledTimes(1);
  //   expect(mockSwal.fire).toBeCalledWith({
  //     icon: "warning",
  //     title: "Warning",
  //     text: "Reset password for account: testUser",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     confirmButtonText: "Reset Password"
  //   });
  // });

  // it("calls auth service forgotPassword", async () => {
  //   wrapper.vm.handleSubmit();
  //   await wrapper.vm.$nextTick();
  //   await flushPromises();
  //   expect(AuthService.forgotPassword).toBeCalledTimes(1);
  //   expect(AuthService.forgotPassword).toBeCalledWith("testUser");
  // });

  // it("does nothing on swal cancel", async () => {
  //   mockSwal.fire = vi.fn().mockImplementation(() => Promise.resolve({ isConfirmed: false }));
  //   wrapper.vm.handleSubmit();
  //   await wrapper.vm.$nextTick();
  //   await flushPromises();
  //   expect(AuthService.forgotPassword).toBeCalledTimes(0);
  // });

  // it("calls swal after successful auth service forgotPassword call", async () => {
  //   wrapper.vm.handleSubmit();
  //   await wrapper.vm.$nextTick();
  //   await flushPromises();
  //   expect(mockSwal.fire).toBeCalledTimes(2);
  //   expect(mockSwal.fire).toHaveBeenLastCalledWith({
  //     icon: "success",
  //     title: "Success",
  //     text: "Password has been reset for account: testUser. An email has been sent with a recovery code."
  //   });
  // });

  // it("updates store and reroutes after successful auth service forgotPassword call", async () => {
  //   wrapper.vm.handleSubmit();
  //   await wrapper.vm.$nextTick();
  //   await flushPromises();
  //   expect(mockCommit).toBeCalledTimes(1);
  //   expect(mockCommit).toBeCalledWith("updateRegisteredUsername", "testUser");
  //   expect(mockPush).toBeCalledTimes(1);
  //   expect(mockPush).toBeCalledWith({ name: "ForgotPasswordSubmit" });
  // });

  // it("calls swal after unsuccessful auth service forgotPassword call", async () => {
  //   AuthService.forgotPassword = vi.fn().mockResolvedValue({ status: 400, message: "Password reset failed" });
  //   wrapper.vm.handleSubmit();
  //   await wrapper.vm.$nextTick();
  //   await flushPromises();
  //   expect(mockSwal.fire).toBeCalledTimes(2);
  //   expect(mockSwal.fire).toHaveBeenLastCalledWith({ icon: "error", title: "Error", text: "Password reset failed. Check username is correct." });
  // });
});

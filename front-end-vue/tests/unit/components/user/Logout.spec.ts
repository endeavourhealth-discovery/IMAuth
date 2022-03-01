import Card from "primevue/card";
import Button from "primevue/button";
import { flushPromises, mount } from "@vue/test-utils";
import Logout from "@/components/user/Logout.vue";
import AuthService from "@/services/AuthService";
import { Models, Constants } from "im-library";
const { User, CustomAlert } = Models;
const { Avatars } = Constants;

describe("Logout.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockSwal: any;
  let user: Models.User;

  beforeEach(() => {
    vi.clearAllMocks();
    user = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", Avatars[0]);

    AuthService.signOut = vi.fn().mockResolvedValue({ status: 200, message: "Logout successful" });

    mockSwal = {
      fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
    };
    mockStore = {
      state: { currentUser: user, isLoggedIn: true },
      commit: vi.fn(),
      dispatch: vi.fn().mockResolvedValue(new CustomAlert(200, "logout success"))
    };
    mockRouter = {
      push: vi.fn(),
      go: vi.fn()
    };
    wrapper = mount(Logout, {
      global: {
        components: { Card, Button },
        mocks: { $store: mockStore, $router: mockRouter, $swal: mockSwal }
      }
    });
  });

  it("renders current username from store", async () => {
    const userNameField = wrapper.find("#username-display");
    const userNameInput = userNameField.element as HTMLParagraphElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("username-display");
    expect(userNameInput.textContent).toBe("testUser");
  });

  it("returns the correct image url", async () => {
    vi.mock("@/assets/avatars/colour/013-woman.png", () => {
      return "/img/013-woman.7f32b854.png";
    });
    const url = wrapper.vm.getUrl("colour/013-woman.png");
    expect(url).toBe("/img/013-woman.7f32b854.png");
  });

  it("fires swal on handleSubmit", async () => {
    wrapper.vm.handleSubmit();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockSwal.fire).toBeCalledTimes(2);
    expect(mockSwal.fire).toBeCalledWith({
      icon: "warning",
      title: "Are you sure?",
      text: "Confirm logout request",
      showCancelButton: true,
      confirmButtonText: "Logout",
      reverseButtons: true
    });
  });

  it("does nothing on swal cancel", async () => {
    mockSwal.fire = vi.fn().mockImplementation(() => Promise.resolve({ isConfirmed: false }));
    wrapper.vm.handleSubmit();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockSwal.fire).toBeCalledTimes(1);
    expect(mockStore.dispatch).toBeCalledTimes(0);
  });

  it("dispatches to store on swal confirm", async () => {
    wrapper.vm.handleSubmit();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(mockSwal.fire).toBeCalledTimes(2);
    expect(mockStore.dispatch).toBeCalledTimes(1);
    expect(mockStore.dispatch).toBeCalledWith("logoutCurrentUser");
  });

  it("fires swal on successful store logout", async () => {
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockSwal.fire).toBeCalledTimes(2);
    expect(mockStore.dispatch).toBeCalledTimes(1);
    expect(mockSwal.fire).toHaveBeenLastCalledWith({
      icon: "success",
      title: "Success",
      text: "logout success"
    });
  });

  it("reroutes after logout", async () => {
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockSwal.fire).toBeCalledTimes(2);
    expect(mockStore.dispatch).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith({ name: "Login" });
  });

  it("fires swal on unsuccessful store logout", async () => {
    mockStore.dispatch = vi.fn().mockResolvedValue(new CustomAlert(400, "logout failed"));
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockSwal.fire).toBeCalledTimes(2);
    expect(mockStore.dispatch).toBeCalledTimes(1);
    expect(mockSwal.fire).toHaveBeenLastCalledWith({
      icon: "error",
      title: "Error",
      text: "logout failed"
    });
  });
});

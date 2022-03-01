import { mount } from "@vue/test-utils";
import UserDetails from "@/components/user/UserDetails.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { Models, Constants } from "im-library";
const { User } = Models;
const { Avatars } = Constants;

describe("userDetails.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;

  beforeEach(() => {
    const user = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", Avatars[0]);
    vi.clearAllMocks();
    mockStore = {
      state: { currentUser: user, isLoggedIn: true },
      commit: vi.fn()
    };
    mockRouter = {
      push: vi.fn(),
      go: vi.fn()
    };
    wrapper = mount(UserDetails, {
      global: {
        components: { Card, Button, InputText },
        mocks: { $store: mockStore, $router: mockRouter }
      }
    });
  });

  it("correctly renders User details from store", async () => {
    const userNameField = wrapper.find("#username");
    const userNameInput = userNameField.element as HTMLInputElement;
    const firstNameField = wrapper.find("#firstName");
    const firstNameInput = firstNameField.element as HTMLInputElement;
    const lastNameField = wrapper.find("#lastName");
    const lastNameInput = lastNameField.element as HTMLInputElement;
    const emailField = wrapper.find("#email");
    const emailInput = emailField.element as HTMLInputElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("username");
    expect(userNameInput.value).toBe("testUser");
    expect(firstNameField.exists()).toBe(true);
    expect(firstNameField.element.id).toBe("firstName");
    expect(firstNameInput.value).toBe("John");
    expect(lastNameField.exists()).toBe(true);
    expect(lastNameField.element.id).toBe("lastName");
    expect(lastNameInput.value).toBe("Doe");
    expect(emailField.exists()).toBe(true);
    expect(emailField.element.id).toBe("email");
    expect(emailInput.value).toBe("john.doe@ergosoft.co.uk");
  });

  it("rerouted on handleEditClicked", async () => {
    wrapper.vm.handleEditClicked();
    await wrapper.vm.$nextTick();
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith({ name: "UserEdit" });
  });

  it("returns the correct image url", async () => {
    const testUrl = "file://" + __dirname + "colour/013-woman.png";
    const url = wrapper.vm.getUrl("colour/013-woman.png");
    expect(url).toBe(testUrl);
  });
});

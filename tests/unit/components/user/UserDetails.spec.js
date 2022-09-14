import { mount } from "@vue/test-utils";
import UserDetails from "@/components/user/UserDetails.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { Models, Constants } from "im-library";
const { User } = Models;
const { Avatars } = Constants;

const mockDispatch = vi.fn();
const mockState = {};
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

describe("userDetails.vue", () => {
  let wrapper;

  beforeEach(() => {
    const user = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", Avatars[0]);
    vi.clearAllMocks();
    mockState.currentUser = user;
    mockState.isLoggedIn = true;
    wrapper = mount(UserDetails, {
      global: {
        components: { Card, Button, InputText }
      }
    });
  });

  it("correctly renders User details from store", async () => {
    const userNameField = wrapper.find("#username");
    const userNameInput = userNameField.element;
    const firstNameField = wrapper.find("#firstName");
    const firstNameInput = firstNameField.element;
    const lastNameField = wrapper.find("#lastName");
    const lastNameInput = lastNameField.element;
    const emailField = wrapper.find("#email");
    const emailInput = emailField.element;
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
    expect(mockPush).toBeCalledTimes(1);
    expect(mockPush).toBeCalledWith({ name: "UserEdit" });
  });

  it("returns the correct image url", async () => {
    const testUrl = "src/assets/avatars/colour/013-woman.png";
    const url = wrapper.vm.getUrl("colour/013-woman.png");
    expect(url).toContain(testUrl);
  });
});

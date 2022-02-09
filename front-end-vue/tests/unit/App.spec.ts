import { flushPromises, shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import Toast from "primevue/toast";
import ProgressSpinner from "primevue/progressspinner";

describe("App.vue", () => {
  let wrapper: any;
  let mockStore: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockStore = {
      dispatch: jest.fn()
    };
    wrapper = shallowMount(App, {
      global: {
        components: { Toast, ProgressSpinner },
        stubs: ["router-link", "router-view"],
        mocks: { $store: mockStore }
      }
    });
  });

  it("should check auth and update store history count on mount", async () => {
    await flushPromises();
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith("authenticateCurrentUser");
  });
});

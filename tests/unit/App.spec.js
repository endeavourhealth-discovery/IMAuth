import { flushPromises, shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import Toast from "primevue/toast";
import ProgressSpinner from "primevue/progressspinner";
import * as vuex from "vuex";
import { vi } from "vitest";

vi.mock("vuex", () => ({
  useStore: () => ({
    dispatch: mockDispatch
  })
}));

const mockDispatch = vi.fn();

describe("App.vue", () => {
  let wrapper;

  const restHandlers = [];
  const server = setupServer(...restHandlers);

  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    wrapper = shallowMount(App, {
      global: {
        components: { Toast, ProgressSpinner },
        stubs: ["router-link", "router-view"]
      }
    });
  });

  it("should check auth on mount", async () => {
    await flushPromises();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith("authenticateCurrentUser");
  });
});

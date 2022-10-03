import { flushPromises, shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import Toast from "primevue/toast";
import ProgressSpinner from "primevue/progressspinner";
import { setupServer } from "msw/node";
import * as vuex from "vuex";
import { vi } from "vitest";
import PrimeVue from "primevue/config";
import { render } from "@testing-library/vue";

vi.mock("vuex", () => ({
  useStore: () => ({
    dispatch: mockDispatch
  })
}));

const mockDispatch = vi.fn();

const mockPush = vi.fn();
const mockGo = vi.fn();
const mockRoute = { name: "Concept" };

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
    go: mockGo
  }),
  useRoute: () => mockRoute
}));

const mockAdd = vi.fn();

vi.mock("primevue/usetoast", () => ({
  useToast: () => ({
    add: mockAdd
  })
}));

describe("App.vue", () => {
  let component;

  beforeEach(() => {
    vi.resetAllMocks();
    component = render(App, {
      global: {
        components: { Toast, ProgressSpinner },
        stubs: ["router-link", "router-view", "ReleaseNotes"],
        plugins: [PrimeVue]
      }
    });
  });

  it("should check auth on mount", async () => {
    await flushPromises();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith("authenticateCurrentUser");
  });
});

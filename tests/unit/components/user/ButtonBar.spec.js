import { shallowMount } from "@vue/test-utils";
import ButtonBar from "@/components/user/ButtonBar.vue";
import Button from "primevue/button";
import { setupServer } from "msw/node";
import { Services } from "im-library";
import { vi } from "vitest";
const { Env } = Services;

const mockDispatch = vi.fn();
const mockState = { previousAppUrl: "testUrl" };
const mockCommit = vi.fn();

vi.mock("vuex", () => ({
  useStore: () => ({
    dispatch: mockDispatch,
    state: mockState,
    commit: mockCommit
  })
}));

const mockBack = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({
    back: mockBack
  })
}));

describe("ButtonBar.vue ___ previousAppUrl", () => {
  let wrapper;
  let location;
  let mockLocation;

  const restHandlers = [];
  const server = setupServer(...restHandlers);

  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
    window.location = location;
  });

  beforeEach(() => {
    vi.resetAllMocks();
    mockLocation = { href: "" };
    location = window.location;
    delete window.location;
    window.location = mockLocation;
    wrapper = shallowMount(ButtonBar, {
      global: {
        components: { Button }
      }
    });
  });

  it("should route to home on home button click", async () => {
    const homeButton = wrapper.find(".home-button");
    homeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(window.location.href).toBe("testUrl");
  });

  it("should go back on back button click", async () => {
    const backButton = wrapper.find(".back-button");
    backButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mockBack).toBeCalled();
  });
});

describe("ButtonBar.vue ___ no previousAppUrl", () => {
  let wrapper;
  let location;
  let mockLocation;

  const restHandlers = [];
  const server = setupServer(...restHandlers);

  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  beforeAll(() => {
    vi.clearAllMocks();
  });
  beforeEach(() => {
    vi.resetAllMocks();
    mockState.previousAppUrl = null;
    mockLocation = { href: "" };
    location = window.location;
    delete window.location;
    window.location = mockLocation;
    wrapper = shallowMount(ButtonBar, {
      global: {
        components: { Button }
      }
    });
  });
  afterEach(() => {
    window.location = location;
  });

  it("should route to home on home button click", async () => {
    const homeButton = wrapper.find(".home-button");
    homeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(window.location.href).toBe(Env.DIRECTORY_URL);
  });
});

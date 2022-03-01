import { shallowMount } from "@vue/test-utils";
import ButtonBar from "@/components/user/ButtonBar.vue";
import Button from "primevue/button";

describe("ButtonBar.vue ___ previousAppUrl", () => {
  let wrapper;
  let mockStore;
  let mockRouter;
  let location;
  let mockLocation;
  beforeAll(() => {
    vi.clearAllMocks();
  });
  beforeEach(() => {
    vi.resetAllMocks();
    mockStore = {
      state: { previousAppUrl: "testUrl" },
      commit: vi.fn()
    };
    mockRouter = {
      back: vi.fn()
    };
    mockLocation = { href: "" };
    location = window.location;
    delete window.location;
    window.location = mockLocation;
    wrapper = shallowMount(ButtonBar, {
      global: {
        components: { Button },
        mocks: { $store: mockStore, $router: mockRouter }
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
    expect(window.location.href).toBe("testUrl");
  });

  it("should go back on back button click", async () => {
    const backButton = wrapper.find(".back-button");
    backButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mockRouter.back).toBeCalled();
  });
});

describe("ButtonBar.vue ___ no previousAppUrl", () => {
  let wrapper;
  let mockStore;
  let mockRouter;
  let location;
  let mockLocation;
  beforeAll(() => {
    vi.clearAllMocks();
  });
  beforeEach(() => {
    vi.resetAllMocks();
    mockStore = {
      state: { previousAppUrl: null },
      commit: vi.fn()
    };
    mockRouter = {
      back: vi.fn()
    };
    mockLocation = { href: "" };
    location = window.location;
    delete window.location;
    window.location = mockLocation;
    wrapper = shallowMount(ButtonBar, {
      global: {
        components: { Button },
        mocks: { $store: mockStore, $router: mockRouter }
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
    expect(window.location.href).toBe(import.meta.env.VITE_DIRECTORY);
  });
});

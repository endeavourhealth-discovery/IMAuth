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
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.resetAllMocks();
    mockStore = {
      state: { previousAppUrl: "testUrl" },
      commit: jest.fn()
    };
    mockRouter = {
      back: jest.fn()
    };
    mockLocation = { assign: jest.fn() };
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
    expect(window.location.assign).toHaveBeenCalledWith("testUrl");
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
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.resetAllMocks();
    mockStore = {
      state: { previousAppUrl: null },
      commit: jest.fn()
    };
    mockRouter = {
      back: jest.fn()
    };
    mockLocation = { assign: jest.fn() };
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
    expect(window.location.assign).toHaveBeenCalledWith(process.env.VUE_APP_DIRECTORY);
  });
});

import router from "@/router/index";
import App from "@/App.vue";
import Toast from "primevue/toast";
import store from "@/store/index";
import { setupServer } from "msw/node";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { vi } from "vitest";

const mockAdd = vi.fn();

vi.mock("primevue/usetoast", () => ({
  useToast: () => ({
    add: mockAdd
  })
}));

describe("router", () => {
  describe("router ___ no auth", () => {
    let wrapper;

    beforeEach(async () => {
      vi.resetAllMocks();
      window.sessionStorage.clear();
      store.dispatch = vi.fn().mockResolvedValue({ authenticated: false });
      router.push("/");
      await router.isReady();

      wrapper = shallowMount(App, {
        global: {
          components: { Toast },
          plugins: [router, store],
          stubs: { ReleaseNotes: true }
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();
      vi.clearAllMocks();
    });

    it("routes to login if false", async () => {
      router.push({ name: "UserEdit" });
      await flushPromises();
      expect(wrapper.vm.$route.path).toBe("/login");
    });
  });

  describe("router ___ auth", () => {
    let wrapper;

    beforeEach(async () => {
      vi.resetAllMocks();
      window.sessionStorage.clear();
      store.dispatch = vi.fn().mockResolvedValue({ authenticated: true });
      router.push("/");
      await router.isReady();

      wrapper = shallowMount(App, {
        global: {
          components: { Toast },
          plugins: [router, store],
          stubs: { ReleaseNotes: true }
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();
      vi.clearAllMocks();
    });

    it("routes to login if false", async () => {
      router.push({ name: "UserEdit" });
      await flushPromises();
      expect(wrapper.vm.$route.path).toBe("/my-account/edit");
    });
  });
});

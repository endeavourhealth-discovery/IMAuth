import { shallowMount } from "@vue/test-utils";
import AvatarWithSelector from "@/components/user/AvatarWithSelector.vue";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import OverlayPanel from "primevue/overlaypanel";
import { setupServer } from "msw/node";

describe("AvatarWithSelector.vue", () => {
  let wrapper;
  let mockRef;

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
    mockRef = { render: () => {}, methods: { toggle: vi.fn() } };

    wrapper = shallowMount(AvatarWithSelector, {
      props: { selectedAvatar: "colour/002-man.png" },
      global: {
        components: { Button, SelectButton, OverlayPanel },
        stubs: { OverlayPanel: mockRef }
      }
    });
  });

  it("starts with prop value selected", async () => {
    expect(wrapper.vm.newAvatar).toStrictEqual("colour/002-man.png");
  });

  it("starts with a list of avatars", async () => {
    expect(wrapper.vm.avatarOptions.length).toBeGreaterThan(1);
  });

  it("returns the correct image url", async () => {
    const testUrl = "src/assets/avatars/colour/013-woman.png";
    const url = wrapper.vm.getUrl("colour/013-woman.png");
    expect(url).toContain(testUrl);
  });

  it("can toggleAvatarSelect", () => {
    wrapper.vm.toggleAvatarSelect("testEvent");
    expect(mockRef.methods.toggle).toHaveBeenCalledTimes(1);
    expect(mockRef.methods.toggle).toHaveBeenCalledWith("testEvent");
  });
});

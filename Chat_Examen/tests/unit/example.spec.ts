import { mount } from "@vue/test-utils";
import HomePage from "../../src/views/LoginPages.vue";
import { describe, expect, test } from "vitest";

describe("LoginPages.vue", () => {
  test("renders login vue", () => {
    const wrapper = mount(HomePage);
    expect(wrapper.text()).toMatch("Ready to create an app?");
  });
});

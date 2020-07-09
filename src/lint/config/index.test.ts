import { applyPresets, discoverConfig } from "./";
import { RulesPreset } from "./schema";
import { defaultPreset } from "../presets";

describe("'applyPresets' function", () => {
  describe("when null config is passed", () => {
    it("should return the default preset", () => {
      const preset = applyPresets(null);
      expect(preset).toEqual(defaultPreset);
    });
  });

  describe("when config rule map is empty", () => {
    it("should return the default preset", () => {
      const preset = applyPresets({
        preset: "default",
        rules: {},
      });
      expect(preset).toEqual(defaultPreset);
    });
  });

  describe("when no preset name is provided", () => {
    it("should use the default preset", () => {
      const preset = applyPresets({
        rules: {
          "subject-max-length": ["on", 100, 100],
        },
      });
      expect(preset).toEqual({
        ...defaultPreset,
        "subject-max-length": ["on", 100, 100],
      });
    });
  });

  describe("when config modifies existing rules in default preset", () => {
    it("should merge modifications with default preset", () => {
      const preset = applyPresets({
        preset: "default",
        rules: {
          "body-max-line-length": ["off"],
          "subject-max-length": ["on", 100, 100],
        },
      });
      expect(preset).toEqual({
        ...defaultPreset,
        "body-max-line-length": ["off", null, 80],
        "subject-max-length": ["on", 100, 100],
      });
    });
  });

  describe("when config adds rules not in default preset", () => {
    it("should merge default preset rules with new rules", () => {
      const newRules = {
        "my-new-rule": ["on", 5, 200, 200],
        "my-new-rule-2": ["on", 100, 100],
      } as RulesPreset;
      const config = applyPresets({
        preset: "default",
        rules: newRules,
      });
      expect(config).toEqual({
        ...defaultPreset,
        ...newRules,
      });
    });
  });
});

describe("'discoverConfig' function", () => {
  describe("when file loader returns null", () => {
    it("should return null", async () => {
      const fileLoader = jest.fn();
      fileLoader.mockReturnValue(Promise.resolve(null));
      const config = await discoverConfig(fileLoader);
      expect(config).toBeNull();
    });
  });

  describe("when file loader returns invalid YAML", () => {
    it("should return null", async () => {
      const fileLoader = jest.fn();
      fileLoader.mockReturnValue(Promise.resolve("- : this is invalid yaml"));
      const config = await discoverConfig(fileLoader);
      expect(config).toBeNull();
    });
  });

  describe("when file loader returns invalid config string", () => {
    it("should return null", async () => {
      const fileLoader = jest.fn();
      fileLoader.mockReturnValue(
        Promise.resolve("preset: this is not a valid preset")
      );
      const config = await discoverConfig(fileLoader);
      expect(config).toBeNull();
    });
  });
});

import { applyPresets } from "./";
import { Config, RulesPreset } from "./schema";
import { defaultPreset } from "../presets";

describe("'applyPresets' function", () => {
  describe("when config is invalid", () => {
    it("should return the default preset", () => {
      const invalidConfigs = [
        null,
        {
          a: 1,
          b: 1,
        },
        {
          preset: "default",
          rules: null,
        },
        {
          preset: "default",
          rules: {
            "sample-rule": [],
          },
        },
      ];
      for (const invalidConfig of invalidConfigs) {
        const preset = applyPresets(invalidConfig as Config);
        expect(preset).toEqual(defaultPreset);
      }
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

import ConfigSchema from "./schema";
import { ValidationError } from "@hapi/joi";

describe("Linter config schema", () => {
  describe("when a non-object is passed", () => {
    it("should return a ValidationError", () => {
      const invalidInput = [null, [1, 2], 2];
      for (const input of invalidInput) {
        const { error } = ConfigSchema.validate(input);
        expect(error).toBeInstanceOf(ValidationError);
      }
    });
  });

  describe("when an invalid preset name is provided", () => {
    it("should return a ValidationError", () => {
      const invalidPresetName = "RANDOM_PRESET_NAME";
      const { error } = ConfigSchema.validate({
        preset: invalidPresetName,
      });
      expect(error).toBeInstanceOf(ValidationError);
    });
  });

  describe("when an empty rule map is provided", () => {
    it("should not return an Error", () => {
      const { error } = ConfigSchema.validate({
        preset: "default",
        rules: {},
      });
      expect(error).toBeUndefined();
    });
  });

  describe("when rule config is not an array of values", () => {
    it("should return a ValidationError", () => {
      const { error } = ConfigSchema.validate({
        preset: "default",
        rules: {
          "my-sample-rule": 100,
        },
      });
      expect(error).toBeInstanceOf(ValidationError);
    });
  });

  describe("when rule config has invalid array values or an empty array", () => {
    it("should return a ValidationError", () => {
      const invalidPresets = [
        {
          "my-sample-rule": [100, 100, 100],
        },
        {
          "my-sample-rule": [],
        },
      ];
      for (const preset of invalidPresets) {
        const { error } = ConfigSchema.validate({
          preset: "default",
          rule: preset,
        });
        expect(error).toBeInstanceOf(ValidationError);
      }
    });
  });

  describe("when rule config only has the first array element", () => {
    it("should not return an Error", () => {
      const { error } = ConfigSchema.validate({
        preset: "default",
        rules: {
          "my-sample-rule": ["on"],
        },
      });
      expect(error).toBeUndefined();
    });
  });

  describe("when rule config has valid array values in the wrong order", () => {
    it("should return a ValidationError", () => {
      const { error } = ConfigSchema.validate({
        preset: "default",
        rules: {
          "my-sample-rule": [10, "on"],
        },
      });
      expect(error).toBeInstanceOf(ValidationError);
    });
  });
});

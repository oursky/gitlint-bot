import { discoverConfig, instantiateConfig } from "./";
import { defaultPreset } from "../presets";
import { YAMLException } from "js-yaml";

describe("'instantiateConfig' function", () => {
  describe("when no config is passed", () => {
    it("should return default config", () => {
      const config = instantiateConfig();
      expect(config).toEqual({
        headerPattern: undefined,
        rules: {
          ...defaultPreset,
        },
      });
    });
  });

  describe("when multiple config is passed", () => {
    it("should merge the config sequentially", () => {
      const config = instantiateConfig(
        { rules: { "body-max-line-length": ["off"] } },
        { "header-regex": "^test$" },
        { rules: { "subject-max-length": ["on", 100, 100] } },
        { rules: { "my-new-rule": ["on", 5, 200, 200] } }
      );
      expect(config).toEqual({
        headerPattern: /^test$/,
        rules: {
          ...defaultPreset,
          "body-max-line-length": ["off", null, 80],
          "subject-max-length": ["on", 100, 100],
          "my-new-rule": ["on", 5, 200, 200],
        },
      });
    });
    it("should override previous configs", () => {
      const config = instantiateConfig(
        { "header-regex": "^test1$" },
        { rules: { "body-max-line-length": ["off"] } },
        { "header-regex": "^test2$" },
        { rules: { "body-max-line-length": ["on", 100, 100] } }
      );
      expect(config).toEqual({
        headerPattern: /^test2$/,
        rules: {
          ...defaultPreset,
          "body-max-line-length": ["on", 100, 100],
        },
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
    it("should throw a YAMLException", async () => {
      const fileLoader = jest.fn();
      fileLoader.mockReturnValue(Promise.resolve("- : this is invalid yaml"));
      await expect(discoverConfig(fileLoader)).rejects.toThrow(YAMLException);
    });
  });

  describe("when file loader returns invalid config string", () => {
    it("should throw a ConfigValidationError", async () => {
      const fileLoader = jest.fn();
      fileLoader.mockReturnValue(
        Promise.resolve("preset: this is not a valid preset")
      );
      await expect(discoverConfig(fileLoader)).rejects.toThrow(
        "error validating config schema in '.gitlintrc':\n\"preset\" must be [default]"
      );
    });
  });
});

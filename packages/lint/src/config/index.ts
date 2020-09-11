import { safeLoad } from "js-yaml";
import ConfigSchema, { Config, RulesPreset } from "./schema";
import { ConfigValidationError } from "./errors";
import presets, { defaultPresetName } from "../presets";

export interface EffectiveConfig {
  headerPattern: RegExp | undefined;
  rules: RulesPreset;
}

export const configFileName = ".gitlintrc";
export const configFileExtensions = ["", ".yaml", ".yml"];

export type FileLoader = (path: string) => Promise<string | null>;

export async function discoverConfig(
  fileLoader: FileLoader
): Promise<Config | null> {
  for (const extension of configFileExtensions) {
    const path = configFileName + extension;
    const configString = await fileLoader(path);
    if (configString === null) continue;
    const config = safeLoad(configString);
    if (typeof config !== "object") continue;
    const { error } = ConfigSchema.validate(config);
    if (typeof error !== "undefined")
      throw new ConfigValidationError(path, error.details);
    return config;
  }
  return null;
}

export function instantiateConfig(...configs: Config[]): EffectiveConfig {
  const effectiveConfig: EffectiveConfig = {
    headerPattern: undefined,
    rules: {},
  };
  const applyRules = (rules: RulesPreset) => {
    for (const [ruleName, ruleConfig] of Object.entries(rules)) {
      if (typeof effectiveConfig.rules[ruleName] === "undefined") {
        effectiveConfig.rules[ruleName] = ruleConfig;
        continue;
      }
      ruleConfig.forEach((configElement, idx) => {
        effectiveConfig.rules[ruleName][idx] = configElement as unknown;
      });
    }
  };

  applyRules(presets[configs[0]?.preset ?? defaultPresetName]);
  for (const config of configs) {
    if (config["header-regex"] != null) {
      effectiveConfig.headerPattern = new RegExp(config["header-regex"]);
    }

    if (config.rules != null) {
      applyRules(config.rules);
    }
  }

  return effectiveConfig;
}

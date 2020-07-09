import { safeLoad } from "js-yaml";
import ConfigSchema, { Config, RulesPreset } from "./schema";
import { ConfigValidationError } from "./errors";
import presets, { defaultPreset, defaultPresetName } from "../presets";

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

// eslint-disable-next-line
export function applyPresets(config: Config | null): RulesPreset {
  if (config === null) return defaultPreset;
  const preset = presets[config.preset ?? defaultPresetName];
  const rules = config.rules ?? {};
  const mergedRules = { ...preset };
  for (const [ruleName, ruleConfig] of Object.entries(rules)) {
    if (typeof mergedRules[ruleName] === "undefined") {
      mergedRules[ruleName] = ruleConfig;
      continue;
    }
    ruleConfig.forEach((configElement, idx) => {
      mergedRules[ruleName][idx] = configElement as unknown;
    });
  }
  return mergedRules;
}

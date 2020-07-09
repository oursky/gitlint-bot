import { safeLoad, YAMLException } from "js-yaml";
import ConfigSchema, { Config, RulesPreset } from "./schema";
import presets, { defaultPreset, defaultPresetName } from "../presets";

export const configFileName = ".gitlintrc";
export const configFileExtensions = ["", ".yaml", ".yml"];

export type FileLoader = (path: string) => Promise<string | null>;

export async function discoverConfig(
  fileLoader: FileLoader
): Promise<Config | null> {
  let config = null;
  for (const extension of configFileExtensions) {
    const path = configFileName + extension;
    const configString = await fileLoader(path);
    if (configString === null) continue;
    try {
      config = safeLoad(configString);
    } catch (err) {
      if (err === YAMLException) continue;
    }
    if (typeof config === "object") break;
  }
  const { error } = ConfigSchema.validate(config);
  if (typeof error !== "undefined") return null;
  return config as Config | null;
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

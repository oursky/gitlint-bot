import ConfigSchema, { Config, RulesPreset } from "./schema";
import presets, { defaultPreset, DEFAULT_PRESET_NAME } from "../presets";

export const CONFIG_FILE_NAME = ".gitlintrc";
export const CONFIG_FILE_EXTENSIONS = ["", ".yaml", ".yml"];

// eslint-disable-next-line
export function applyPresets(config: Config | null): RulesPreset {
  if (config === null) return defaultPreset;
  const { error } = ConfigSchema.validate(config);
  if (typeof error !== "undefined") return defaultPreset;
  const preset = presets[config.preset ?? DEFAULT_PRESET_NAME];
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

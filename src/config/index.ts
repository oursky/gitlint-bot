import { Octokit } from "probot";
import { loadConfigFromGithub } from "./loader";
import ConfigSchema, { Config, RulesConfig } from "./schema";
import presets, { defaultPreset } from "../lint/presets";

const configFileName = ".gitlintrc";
const extensions = ["", ".yaml", ".yml"];

export async function getConfigFromGithub(
  apiClient: Octokit,
  repoFullName: string,
  ref: string
): Promise<RulesConfig> {
  const owner = repoFullName.split("/")[0];
  const repo = repoFullName.split("/")[1];
  let config = null;

  for (const extension of extensions) {
    const path = configFileName + extension;
    config = (await loadConfigFromGithub(apiClient, {
      path,
      owner,
      repo,
      ref,
    })) as Config | null;
    if (config !== null) break;
  }
  if (config === null) return defaultPreset;
  const { error } = ConfigSchema.validate(config);
  if (typeof error !== "undefined") return defaultPreset;
  const preset = presets[config.preset ?? "default"];
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

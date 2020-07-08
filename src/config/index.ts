import { Octokit } from "probot";
import { loadConfig } from "./loader";
import ConfigSchema, { Config, RulesConfig } from "./schema";
import presets, { defaultPreset } from "../lint/presets";

const configFileName = ".gitlintrc";
const extensions = ["", ".yaml", ".yml"];

export async function getConfig(
  apiClient: Octokit,
  repoFullName: string,
  ref: string
): Promise<RulesConfig> {
  const owner = repoFullName.split("/")[0];
  const repo = repoFullName.split("/")[1];
  let config = null;

  for (const extension of extensions) {
    const path = configFileName + extension;
    config = (await loadConfig(apiClient, {
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
  return {
    ...preset,
    ...rules,
  };
}

import fs from "fs";
import path from "path";
import getStdin from "get-stdin";
import readCommits from "@commitlint/read";
import { RulesPreset } from "@oursky/gitlint/lib/config/schema";
import { discoverConfig, applyPresets } from "@oursky/gitlint/lib/config";
import { LintCommandFlags } from "../../types";

const createConfigLoader = (targetFileName: string | undefined) => async (
  defaultFileName: string
): Promise<string | null> => {
  const configFileName = targetFileName ?? defaultFileName;
  const filePath = path.resolve(".", configFileName);
  if (!fs.existsSync(filePath)) return null;
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) return null;
  return fs.readFileSync(filePath, "utf-8");
};

export async function loadPreset(
  configFileName: string | undefined
): Promise<RulesPreset> {
  const loader = createConfigLoader(configFileName);
  const config = await discoverConfig(loader);
  // if config option is invalid
  if (config === null && typeof configFileName !== "undefined") {
    throw new Error(`Config file not found: ${configFileName}`);
  }
  return applyPresets(config);
}

export async function loadCommitMessages(
  flags: LintCommandFlags
): Promise<string[]> {
  if (typeof flags.stdIn !== "undefined" && !!flags.stdIn) {
    const message = await getStdin();
    if (message.length === 0) return [];
    return [message];
  } else if (
    typeof flags.from !== "undefined" ||
    typeof flags.to !== "undefined"
  ) {
    return readCommits({
      from: flags.from,
      to: flags.to,
    });
  } else if (typeof flags.range !== "undefined") {
    const splitRange = flags.range.trim().split("..");
    if (splitRange.length < 2) {
      throw new Error("Invalid double-dot commit range: " + flags.range);
    }
    return readCommits({
      from: splitRange[0],
      to: splitRange[1],
    });
  }
  // Reads last commit from .git/COMMIT_EDITMSG
  return readCommits({ edit: true });
}

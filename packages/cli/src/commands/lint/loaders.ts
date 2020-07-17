import fs from "fs";
import path from "path";
import getStdin from "get-stdin";
import readCommits from "@commitlint/read";
import { RulesPreset } from "@oursky/gitlint/lib/config/schema";
import { discoverConfig, applyPresets } from "@oursky/gitlint/lib/config";
import { LintCommandFlags } from "../../types";

const createConfigLoader = (configFile: string | undefined) => async (
  _: string
): Promise<string | null> => {
  if (typeof configFile === "undefined") return null;
  const filePath = path.resolve(".", configFile);
  if (!fs.existsSync(filePath)) return null;
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) return null;
  return fs.readFileSync(filePath, "utf-8");
};

export async function loadPreset(
  configFile: string | undefined
): Promise<RulesPreset> {
  const loader = createConfigLoader(configFile);
  const config = await discoverConfig(loader);
  if (config === null && typeof configFile !== "undefined") {
    throw new Error(`Config file not found: ${configFile}`);
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
  }
  // Reads last commit from .git/COMMIT_EDITMSG
  return readCommits({ edit: true });
}

import fs from "fs";
import path from "path";
import getStdin from "get-stdin";
import { LintCommandFlags } from "../types";
import { lintCommitMessage } from "@oursky/gitlint";
import { discoverConfig, applyPresets } from "@oursky/gitlint/lib/config";
import { RulesPreset } from "@oursky/gitlint/lib/config/schema";

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

async function loadPreset(
  configFile: string | undefined
): Promise<RulesPreset> {
  const loader = createConfigLoader(configFile);
  const config = await discoverConfig(loader);
  if (config === null && typeof configFile !== "undefined") {
    throw new Error(`Config file not found: ${configFile}`);
  }
  return applyPresets(config);
}

async function loadCommitMessages(flags: LintCommandFlags): Promise<string[]> {
  if (typeof flags.stdIn !== "undefined" && !!flags.stdIn) {
    const message = await getStdin();
    if (message.length === 0) return [];
    return [message];
  }
  return [];
}

async function lintCommand(flags: LintCommandFlags): Promise<void> {
  const preset = await loadPreset(flags.config);
  const messages = await loadCommitMessages(flags);
  if (messages.length === 0) {
    console.log("No commit messages found!");
  }
  for (const message of messages) {
    console.log(message);
    const output = await lintCommitMessage(message, preset);
    console.log(JSON.stringify(output, null, 1));
  }
}

export default lintCommand;

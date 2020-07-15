import fs from "fs";
import path from "path";
import { CliFlags } from "../types";
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

async function lintCommand(flags: CliFlags): Promise<void> {
  const preset = await loadPreset(flags.config);
  console.log(preset);
}

export default lintCommand;

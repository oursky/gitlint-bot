import { RulesPreset } from "./config/schema";

export const defaultPresetName = "default";
export const defaultPreset: RulesPreset = {
  "body-max-line-length": ["on", null, 80],
  "body-no-trailing-whitespace": ["on", null],
  "subject-capitalize-first": ["on", null],
  "subject-max-length": ["on", null, 80],
  "subject-min-length": ["on", null, 10],
  "subject-no-hard-tab": ["on", null],
  "subject-no-trailing-punctuation": ["on", null],
  "subject-no-trailing-whitespace": ["on", null],
};

const presets: Record<string, RulesPreset> = {
  [defaultPresetName]: defaultPreset,
};

export default presets;

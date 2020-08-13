import Joi from "@hapi/joi";
import { defaultPresetName } from "../presets";

type RuleLevel = "on" | "off";
type RuleScore = number | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RuleArgs = any[];
type RuleConfig = [RuleLevel, RuleScore?, ...RuleArgs];
export type RulesPreset = Record<string, RuleConfig>;

export interface Config {
  "header-regex"?: string;
  preset?: string;
  rules?: RulesPreset;
}

const schema = Joi.object<Config>({
  preset: Joi.string().valid(defaultPresetName),
  "header-regex": Joi.string().custom((value: string) => {
    // Check the regex validity by trying to construct a real RegExp object:
    // eslint-disable-next-line no-new
    new RegExp(value);
    return value;
  }),
  rules: Joi.object().pattern(
    /^/,
    Joi.array()
      .ordered(
        Joi.string().valid("on", "off").required(),
        Joi.number().min(0).allow(null)
      )
      .items(Joi.any())
  ),
});

export default schema;

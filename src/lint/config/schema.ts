import Joi from "@hapi/joi";
import { DEFAULT_PRESET_NAME } from "../presets";

type RuleLevel = "on" | "off";
type RuleScore = number | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RuleArgs = any[];
type RuleConfig = [RuleLevel, RuleScore?, ...RuleArgs];
export type RulesPreset = Record<string, RuleConfig>;

export interface Config {
  preset?: "default";
  rules?: RulesPreset;
}

const schema = Joi.object<Config>({
  preset: Joi.string().valid(DEFAULT_PRESET_NAME),
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

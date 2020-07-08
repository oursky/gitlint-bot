import Joi from "@hapi/joi";

type RuleLevel = "on" | "off";
type RuleScore = number | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RuleArgs = any[];
type RuleConfig = [RuleLevel, RuleScore?, ...RuleArgs];

export interface Config {
  preset: "default";
  rules: Record<string, RuleConfig>;
}

const schema = Joi.object<Config>({
  preset: Joi.string().valid("default"),
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

type RuleLevel = "on" | "off";
type RuleScore = number | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RuleArgs = any[];

type RuleConfig = [RuleLevel, RuleScore?, ...RuleArgs];

export interface Config {
  preset: "default";
  rules: Record<string, RuleConfig>;
}

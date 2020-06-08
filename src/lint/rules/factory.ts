import { Commit } from "@commitlint/parse";
import { Rule, RuleViolation } from "./";

export type RuleFactoryCheckResults = null | RuleViolation;
type RuleFactoryCheckFunc = (commit: Commit) => RuleFactoryCheckResults;
interface RuleFactoryParams {
  name: string;
  score: number;
  check: RuleFactoryCheckFunc;
}

export function createRule({ name, score, check }: RuleFactoryParams): Rule {
  return {
    name,
    score,
    check,
  };
}

import { Commit } from "@commitlint/parse";
import { RuleViolationData, RuleCheckResults, Rule } from "./";

export type RuleFactoryCheckResults = null | RuleViolationData;
interface RuleFactoryCheckFunc {
  (commit: Commit): RuleFactoryCheckResults;
}
interface RuleFactoryParams {
  name: string;
  score: number;
  check: RuleFactoryCheckFunc;
}

export function createRule({ name, score, check }: RuleFactoryParams): Rule {
  return {
    name,
    score,
    check: (commit: Commit): RuleCheckResults => {
      const violationData = check(commit);
      if (violationData !== null) {
        return {
          name,
          data: violationData,
        };
      }
      return null;
    },
  };
}

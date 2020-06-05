import { Commit } from "@commitlint/parse";

export type RuleCheckResults = null | Record<string, unknown>;
export interface RuleConfig {
  name: string;
  score: number;
  check: RuleCheckFunc;
}
export interface RuleCheckFunc {
  (commitMessage: Commit): RuleCheckResults;
}
export type RulesList = RuleConfig[];

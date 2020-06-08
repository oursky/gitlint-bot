import { Commit } from "@commitlint/parse";
export { default as subjectCapitalizeFirst } from "./subject-capitalize-first";
export { default as subjectMaxLength } from "./subject-max-length";
export { default as subjectMinLength } from "./subject-min-length";
export { default as subjectNoEndPeriod } from "./subject-no-end-period";

export type RuleCheckResults = null | Record<string, unknown>;
export interface RuleConfig {
  name: string;
  score: number;
  check: RuleCheckFunc;
}
export interface RuleCheckFunc {
  (commitMessage: Commit): RuleCheckResults;
}
export type RulesPreset = RuleConfig[];

import { Commit } from "../parser";
export { default as subjectCapitalizeFirst } from "./subject-capitalize-first";
export { default as subjectMaxLength } from "./subject-max-length";
export { default as subjectMinLength } from "./subject-min-length";
export { default as subjectNoEndPeriod } from "./subject-no-end-period";
export { default as subjectNoTrailingWhitespace } from "./subject-no-trailing-whitespace";

export type RulesPreset = Rule[];
export interface Rule {
  name: string;
  score: number;
  check: RuleCheckFunc;
}

export type RuleCheckFunc = (commit: Commit) => RuleCheckResults;
export type RuleCheckResults = null | RuleViolation;
export type RuleViolation = Record<string, unknown>;

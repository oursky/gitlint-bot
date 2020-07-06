import { Commit } from "../parser";
export { default as subjectCapitalizeFirst } from "./subject-capitalize-first";
export { default as subjectMaxLength } from "./subject-max-length";
export { default as subjectMinLength } from "./subject-min-length";
export { default as subjectNoTrailingPunctuation } from "./subject-no-trailing-punctuation";
export { default as subjectNoTrailingWhitespace } from "./subject-no-trailing-whitespace";
export { default as subjectNoHardTab } from "./subject-no-hard-tab";
export { default as bodyMaxLineLength } from "./body-max-line-length";
export { default as bodyNoTrailingWhitespace } from "./body-no-trailing-whitespace";

export type RulesPreset = Rule[];
export interface Rule {
  name: string;
  score: number;
  check: RuleCheckFunc;
}

export type RuleCheckFunc = (commit: Commit) => RuleCheckResults;
export type RuleCheckResults = null | RuleViolation;
export type RuleViolation = Record<string, unknown>;

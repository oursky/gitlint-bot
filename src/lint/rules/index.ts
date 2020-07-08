import { Commit } from "../parser";
import { RuleArgs } from "../../config/schema";
import subjectCapitalizeFirst from "./subject-capitalize-first";
import subjectMaxLength from "./subject-max-length";
import subjectMinLength from "./subject-min-length";
import subjectNoTrailingPunctuation from "./subject-no-trailing-punctuation";
import subjectNoTrailingWhitespace from "./subject-no-trailing-whitespace";
import subjectNoHardTab from "./subject-no-hard-tab";
import bodyMaxLineLength from "./body-max-line-length";
import bodyNoTrailingWhitespace from "./body-no-trailing-whitespace";

export interface Rule {
  name: string;
  score: number;
  check: RuleCheckFunc;
}

export type RuleCheckFunc = (
  commit: Commit,
  ...ruleArgs: RuleArgs
) => RuleCheckResults;
export type RuleCheckResults = null | RuleViolation;
export type RuleViolation = Record<string, unknown>;

type RulesMapping = Record<string, Rule>;

const ruleMapping: RulesMapping = {
  [subjectCapitalizeFirst.name]: subjectCapitalizeFirst,
  [subjectMaxLength.name]: subjectMaxLength,
  [subjectMinLength.name]: subjectMinLength,
  [subjectNoTrailingPunctuation.name]: subjectNoTrailingPunctuation,
  [subjectNoTrailingWhitespace.name]: subjectNoTrailingWhitespace,
  [subjectNoHardTab.name]: subjectNoHardTab,
  [bodyMaxLineLength.name]: bodyMaxLineLength,
  [bodyNoTrailingWhitespace.name]: bodyNoTrailingWhitespace,
};

export default ruleMapping;

import {
  RulesPreset,
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoTrailingPunctuation,
  subjectNoTrailingWhitespace,
  subjectNoHardTab,
  bodyMaxLineLength,
  bodyNoTrailingWhitespace,
} from "./rules";

export const defaultPreset: RulesPreset = [
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoTrailingPunctuation,
  subjectNoTrailingWhitespace,
  subjectNoHardTab,
  bodyMaxLineLength,
  bodyNoTrailingWhitespace,
];

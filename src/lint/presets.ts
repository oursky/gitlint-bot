import {
  RulesPreset,
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoTrailingPunctuation,
  subjectNoTrailingWhitespace,
  subjectNoHardTab,
} from "./rules";

export const defaultPreset: RulesPreset = [
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoTrailingPunctuation,
  subjectNoTrailingWhitespace,
  subjectNoHardTab,
];

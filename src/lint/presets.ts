import {
  RulesPreset,
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoEndPeriod,
  subjectNoTrailingWhitespace,
} from "./rules";

export const defaultPreset: RulesPreset = [
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoEndPeriod,
  subjectNoTrailingWhitespace,
];

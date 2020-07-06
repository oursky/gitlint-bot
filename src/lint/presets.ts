import {
  RulesPreset,
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoEndPeriod,
  subjectNoTrailingWhitespace,
  subjectNoHardTab,
} from "./rules";

export const defaultPreset: RulesPreset = [
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoEndPeriod,
  subjectNoTrailingWhitespace,
  subjectNoHardTab,
];

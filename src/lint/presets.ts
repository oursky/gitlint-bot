import {
  RulesPreset,
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoEndPeriod,
} from "lint/rules";

export const defaultPreset: RulesPreset = [
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoEndPeriod,
];

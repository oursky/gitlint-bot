import { RulesList } from "types/rules";
import subjectMaxLength from "./subject-max-length";
import subjectMinLength from "./subject-min-length";
import subjectCapitalizeFirst from "./subject-capitalize-first";
import subjectNoEndPeriod from "./subject-no-end-period";

const defaultRules: RulesList = [
  subjectMaxLength,
  subjectMinLength,
  subjectCapitalizeFirst,
  subjectNoEndPeriod,
];

export default defaultRules;

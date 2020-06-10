import path from "path";
import rule from "../../../src/lint/rules/subject-min-length";
import { assertRuleCheck } from "../helper";

describe("'subject-min-length' rule", () => {
  describe("when commit subject is < 10 characters", () => {
    it("should return a violation", async () => {
      await assertRuleCheck(path.join(__dirname, "less-than-min"), rule.check);
    });
  });

  describe("when commit subject is >= 10 characters", () => {
    it("should return null", async () => {
      await assertRuleCheck(path.join(__dirname, "more-than-min"), rule.check);
    });
  });
});

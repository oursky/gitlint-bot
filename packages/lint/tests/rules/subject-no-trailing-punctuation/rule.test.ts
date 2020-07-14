import path from "path";
import rule from "../../../src/rules/subject-no-trailing-punctuation";
import { assertRuleCheck } from "../helper";

describe("'subject-no-trailing-punctuation' rule", () => {
  describe("when commit subject ends with a period", () => {
    it("should return a violation", async () => {
      await assertRuleCheck(path.join(__dirname, "has-end-period"), rule.check);
    });
  });

  describe("when commit subject ends with punctuation", () => {
    it("should return a violation", async () => {
      await assertRuleCheck(
        path.join(__dirname, "has-end-punctuation"),
        rule.check
      );
    });
  });

  describe("when commit subject doesn't end with punctuation", () => {
    it("should return null", async () => {
      await assertRuleCheck(
        path.join(__dirname, "no-end-punctuation"),
        rule.check
      );
    });
  });
});

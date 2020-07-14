import path from "path";
import rule from "../../../src/rules/subject-no-trailing-whitespace";
import { assertRuleCheck } from "../helper";

describe("'subject-no-trailing-whitespace' rule", () => {
  describe("when commit subject contains trailing whitespace", () => {
    it("should return a violation", async () => {
      await assertRuleCheck(
        path.join(__dirname, "has-trailing-whitespace"),
        rule.check
      );
    });
  });

  describe("when commit subject does not contain trailing whitespace", () => {
    it("should return null", async () => {
      await assertRuleCheck(
        path.join(__dirname, "no-trailing-whitespace"),
        rule.check
      );
    });
  });
});

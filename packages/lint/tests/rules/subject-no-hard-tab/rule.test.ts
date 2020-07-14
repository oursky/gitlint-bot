import path from "path";
import rule from "../../../src/rules/subject-no-hard-tab";
import { assertRuleCheck } from "../helper";

describe("'subject-no-hard-tab' rule", () => {
  describe("when commit subject contains hard tab", () => {
    it("should return a violation", async () => {
      await assertRuleCheck(path.join(__dirname, "has-hard-tab"), rule.check);
    });
  });

  describe("when commit subject does not contain hard tab", () => {
    it("should return null", async () => {
      await assertRuleCheck(path.join(__dirname, "no-hard-tab"), rule.check);
    });
  });
});

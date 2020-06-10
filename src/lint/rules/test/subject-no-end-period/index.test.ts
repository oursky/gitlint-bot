import path from "path";
import rule from "../../subject-no-end-period";
import { assertRuleCheck } from "../helper";

describe("'subject-no-end-period' rule", () => {
  describe("when commit subject ends with a period", () => {
    it("should return a violation", async () => {
      await assertRuleCheck(path.join(__dirname, "has-end-period"), rule.check);
    });
  });

  describe("when commit subject doesn't end with a period", () => {
    it("should return null", async () => {
      await assertRuleCheck(path.join(__dirname, "no-end-period"), rule.check);
    });
  });
});

import path from "path";
import rule from "../../subject-max-length";
import { assertRuleCheck } from "../helper";

describe("'subject-max-length' rule", () => {
  describe("when commit subject is <= 50 characters", () => {
    it("should return null", async () => {
      await assertRuleCheck(path.join(__dirname, "less-than-max"), rule.check);
    });
  });

  describe("when commit subject is > 50 characters", () => {
    it("should return a violation", async () => {
      await assertRuleCheck(path.join(__dirname, "more-than-max"), rule.check);
    });
  });
});

import path from "path";
import rule from "../../../src/rules/body-max-line-length";
import { assertRuleCheck } from "../helper";

describe("'body-max-line-length' rule", () => {
  describe("when any line of commit body is > 80 characters", () => {
    it("should return a violation", async () => {
      await assertRuleCheck(path.join(__dirname, "more-than-max"), rule.check);
    });
  });

  describe("when lines of commit body is < 80 characters", () => {
    it("should return null", async () => {
      await assertRuleCheck(path.join(__dirname, "less-than-max"), rule.check);
    });
  });
});

import path from "path";
import rule from "../../../src/lint/rules/body-no-trailing-whitespace";
import { assertRuleCheck } from "../helper";

describe("'body-no-trailing-whitespace' rule", () => {
  describe("when commit body contains trailing whitespace", () => {
    it("should return a violation", async () => {
      await assertRuleCheck(
        path.join(__dirname, "has-trailing-whitespace"),
        rule.check
      );
    });
  });

  describe("when commit body does not contain trailing whitespace", () => {
    it("should return null", async () => {
      await assertRuleCheck(
        path.join(__dirname, "no-trailing-whitespace"),
        rule.check
      );
    });
  });
});

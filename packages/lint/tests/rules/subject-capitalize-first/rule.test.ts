import path from "path";
import rule from "../../../src/rules/subject-capitalize-first";
import { assertRuleCheck } from "../helper";

describe("'subject-capitalize-first' rule", () => {
  describe("when first letter of commit subject is not capitalized", () => {
    it("should return an empty violation", async () => {
      await assertRuleCheck(
        path.join(__dirname, "first-not-capitalized"),
        rule.check
      );
    });
  });

  describe("when first letter of commit subject is capitalized", () => {
    it("should return null", async () => {
      await assertRuleCheck(
        path.join(__dirname, "first-capitalized"),
        rule.check
      );
    });
  });
});

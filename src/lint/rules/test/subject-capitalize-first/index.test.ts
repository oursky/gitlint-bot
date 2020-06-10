import fs from "fs";
import path from "path";
import rule from "../../subject-capitalize-first";
import firstNotCapitalizedOutput from "./first-not-capitalized/output.json";
import firstCapitalizedOuput from "./first-capitalized/output.json";
import { parseCommit } from "../../../../lint/parser";

const firstNotCapitalizedInput = fs.readFileSync(
  path.join(__dirname, "first-not-capitalized", "input.txt"),
  "utf8"
);
const firstCapitalizedInput = fs.readFileSync(
  path.join(__dirname, "first-capitalized", "input.txt"),
  "utf8"
);

describe("'subject-capitalize-first' rule", () => {
  describe("when first letter of commit subject is not capitalized", () => {
    it("should return an empty violation", async () => {
      const parsedCommit = await parseCommit(firstNotCapitalizedInput);
      const output = rule.check(parsedCommit);
      expect(output).toEqual(firstNotCapitalizedOutput);
    });
  });

  describe("when first letter of commit subject is capitalized", () => {
    it("should return null", async () => {
      const parsedCommit = await parseCommit(firstCapitalizedInput);
      const output = rule.check(parsedCommit);
      expect(output).toEqual(firstCapitalizedOuput);
    });
  });
});

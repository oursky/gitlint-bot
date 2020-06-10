import fs from "fs";
import path from "path";
import rule from "../../subject-min-length";
import lessThanMinOutput from "./less-than-min/output.json";
import moreThanMinOutput from "./more-than-min/output.json";
import { parseCommit } from "../../../parser";

const lessThanMinInput = fs.readFileSync(
  path.join(__dirname, "less-than-min", "input.txt"),
  "utf8"
);
const moreThanMinInput = fs.readFileSync(
  path.join(__dirname, "more-than-min", "input.txt"),
  "utf8"
);

describe("'subject-min-length' rule", () => {
  describe("when commit subject is < 10 characters", () => {
    it("should return a violation", async () => {
      const parsedCommit = await parseCommit(lessThanMinInput);
      const output = rule.check(parsedCommit);
      expect(output).toEqual(lessThanMinOutput);
    });
  });

  describe("when commit subject is >= 10 characters", () => {
    it("should return null", async () => {
      const parsedCommit = await parseCommit(moreThanMinInput);
      const output = rule.check(parsedCommit);
      expect(output).toEqual(moreThanMinOutput);
    });
  });
});

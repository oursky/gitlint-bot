import fs from "fs";
import path from "path";
import rule from "../../subject-max-length";
import lessThanMaxOutput from "./less-than-max/output.json";
import moreThanMaxOutput from "./more-than-max/output.json";
import { parseCommit } from "../../../../lint/parser";

const lessThanMaxInput = fs.readFileSync(
  path.join(__dirname, "less-than-max", "input.txt"),
  "utf8"
);
const moreThanMaxInput = fs.readFileSync(
  path.join(__dirname, "more-than-max", "input.txt"),
  "utf8"
);

describe("'subject-max-length' rule", () => {
  describe("when commit subject is <= 50 characters", () => {
    it("should return null", async () => {
      const parsedCommit = await parseCommit(lessThanMaxInput);
      const output = rule.check(parsedCommit);
      expect(output).toEqual(lessThanMaxOutput);
    });
  });

  describe("when commit subject is > 50 characters", () => {
    it("should return a violation", async () => {
      const parsedCommit = await parseCommit(moreThanMaxInput);
      const output = rule.check(parsedCommit);
      expect(output).toEqual(moreThanMaxOutput);
    });
  });
});

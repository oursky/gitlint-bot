import fs from "fs";
import path from "path";
import rule from "../../subject-no-end-period";
import hasEndPeriodOutput from "./has-end-period/output.json";
import noEndPeriodOutput from "./no-end-period/output.json";
import { parseCommit } from "../../../parser";

const hasEndPeriodInput = fs.readFileSync(
  path.join(__dirname, "has-end-period", "input.txt"),
  "utf-8"
);
const noEndPeriodInput = fs.readFileSync(
  path.join(__dirname, "no-end-period", "input.txt"),
  "utf-8"
);

describe("'subject-no-end-period' rule", () => {
  describe("when commit subject ends with a period", () => {
    it("should return a violation", async () => {
      const parsedCommit = await parseCommit(hasEndPeriodInput);
      const output = rule.check(parsedCommit);
      expect(output).toEqual(hasEndPeriodOutput);
    });
  });

  describe("when commit subject doesn't end with a period", () => {
    it("should return null", async () => {
      const parsedCommit = await parseCommit(noEndPeriodInput);
      const output = rule.check(parsedCommit);
      expect(output).toEqual(noEndPeriodOutput);
    });
  });
});

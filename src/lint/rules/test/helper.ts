import fs from "fs";
import path from "path";

import { RuleCheckFunc, RuleViolation } from "../";
import { parseCommit } from "../../parser";

const INPUT_FILE_NAME = "input.txt";
const OUTPUT_FILE_NAME = "output.json";

export async function assertRuleCheck(
  testPath: string,
  checkFunc: RuleCheckFunc
): Promise<void> {
  const inputPath = path.resolve(testPath, INPUT_FILE_NAME);
  const outputPath = path.resolve(testPath, OUTPUT_FILE_NAME);

  const commitMessage = fs.readFileSync(inputPath, "utf-8");
  const expectedOutput = JSON.parse(
    fs.readFileSync(outputPath, "utf8")
  ) as RuleViolation;
  const commit = await parseCommit(commitMessage);
  const output = checkFunc(commit);
  expect(output).toEqual(expectedOutput);
}

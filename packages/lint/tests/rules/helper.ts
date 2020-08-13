import fs from "fs";
import path from "path";

import { RuleCheckFunc, RuleViolation } from "../../src/rules";
import { parseCommit } from "../../src/parser";
import { instantiateConfig } from "../../src/config";

const INPUT_FILE_EXT = ".input.txt";
const OUTPUT_FILE_EXT = ".output.json";

export async function assertRuleCheck(
  testFileBase: string,
  checkFunc: RuleCheckFunc
): Promise<void> {
  const inputPath = path.format({
    name: testFileBase,
    ext: INPUT_FILE_EXT,
  });
  const outputPath = path.format({
    name: testFileBase,
    ext: OUTPUT_FILE_EXT,
  });

  const commitMessage = fs.readFileSync(inputPath, "utf-8");
  const expectedOutput = JSON.parse(
    fs.readFileSync(outputPath, "utf8")
  ) as RuleViolation;
  const commit = await parseCommit(commitMessage, instantiateConfig());
  const output = checkFunc(commit);
  expect(output).toEqual(expectedOutput);
}

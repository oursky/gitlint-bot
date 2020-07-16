import { LintResult } from "@oursky/gitlint";
import chalk from "chalk";

type LintReportResults = LintReportResult[];
interface LintReportResult extends LintResult {
  commitMessage: string;
}

const signs = {
  cross: "✖",
};

function formatCommitMessage(message: string): string {
  return `input: ${chalk.bold(message)}`;
}

function formatResult(result: LintReportResult): string[] {
  if (result.violations.length === 0) {
    return [];
  }
  let messageComponents = [formatCommitMessage(result.commitMessage)];
  for (const violation of result.violations) {
    const title = `${chalk.red(signs.cross)}   ${violation.ruleName}: ${
      violation.score
    }`;
    const info = `    - ${JSON.stringify(violation.violation)}`;
    messageComponents = messageComponents.concat([title, info]);
  }
  return messageComponents;
}

export function formatResults(results: LintReportResults): string {
  let violations = 0;
  let messageComponents: string[] = [];
  for (const result of results) {
    if (result.violations.length === 0) {
      continue;
    }
    const formattedResult = formatResult(result);
    messageComponents = messageComponents.concat(formattedResult, "");
    violations += result.violations.length;
  }
  if (violations > 0) {
    const summaryText = chalk.bold(`${violations} problems found`);
    messageComponents.push(`${chalk.red(signs.cross)}   ${summaryText}`);
  }
  return messageComponents.join("\n");
}

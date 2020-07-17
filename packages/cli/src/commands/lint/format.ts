import chalk from "chalk";
import { LintReport, LintReportResult } from "./";

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

export function formatReport(report: LintReport): string {
  let messageComponents: string[] = [];
  for (const result of report.results) {
    if (result.violations.length === 0) {
      continue;
    }
    const formattedResult = formatResult(result);
    messageComponents = messageComponents.concat(formattedResult, "");
  }
  const summaryText = chalk.bold(`${report.violationCount} problems found`);
  messageComponents.push(`${chalk.red(signs.cross)}   ${summaryText}`);
  return messageComponents.join("\n");
}

import { LintCommandFlags } from "../../types";
import { lintCommitMessage, LintResult } from "@oursky/gitlint";
import { EffectiveConfig } from "@oursky/gitlint/lib/config";
import { loadConfig, loadCommitMessages } from "./loaders";
import { formatReport } from "./format";

export interface LintReport {
  violationCount: number;
  results: LintReportResult[];
}
export interface LintReportResult extends LintResult {
  commitMessage: string;
}

async function createLintReport(
  messages: string[],
  config: EffectiveConfig
): Promise<LintReport> {
  const report: LintReport = {
    results: [],
    violationCount: 0,
  };
  for (const message of messages) {
    const result = await lintCommitMessage(message, config);
    report.violationCount += result.violations.length;
    report.results.push({
      ...result,
      commitMessage: message,
    });
  }
  return report;
}

async function lintCommand(flags: LintCommandFlags): Promise<void> {
  const config = await loadConfig(flags.config);
  const messages = await loadCommitMessages(flags);
  if (messages.length === 0) {
    console.log("No commit messages found!");
    process.exit(0);
  }
  const report = await createLintReport(messages, config);
  if (report.violationCount > 0) {
    const formattedResults = formatReport(report);
    console.log(formattedResults);
    process.exit(1);
  }
}

export default lintCommand;

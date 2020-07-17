import fs from "fs";
import path from "path";
import childProcess from "child_process";

const hookIdentifier = "### gitlint-cli commit-msg hook ###";
const hookSrcPath = path.resolve(__dirname, "../../files/commit-msg");
const hookDestFilename = "commit-msg";

function getHooksPath() {
  return childProcess
    .execSync("git rev-parse --git-path hooks")
    .toString()
    .trim(); // strips newline character
}

export function installHook(): void {
  const hooksPath = getHooksPath();
  const destPath = path.resolve(hooksPath, hookDestFilename);
  if (fs.existsSync(destPath)) {
    throw new Error(
      `There is an existing commit-msg hook at ${destPath}, gitlint-cli does not support appending to an existing commit-msg hook`
    );
  }
  fs.copyFileSync(hookSrcPath, destPath);
  fs.chmodSync(destPath, 0o755);
  console.log("Successfully installed commit-msg hook at " + destPath);
}

export function uninstallHook(): void {
  const hooksPath = getHooksPath();
  const destPath = path.resolve(hooksPath, hookDestFilename);
  if (!fs.existsSync(destPath)) {
    throw new Error(`There is no commit-msg hook at ${destPath}`);
  }
  const fileContents = fs.readFileSync(destPath, "utf-8");
  const lines = fileContents.split("\n");
  if (lines.length < 2 || lines[1] !== hookIdentifier) {
    throw new Error(
      `The commit-msg hook at ${destPath} was not created by gitlint-cli`
    );
  }
  fs.unlinkSync(destPath);
  console.log("Successfully uninstalled commit-msg hook at " + destPath);
}

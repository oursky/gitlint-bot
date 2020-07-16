import fs from "fs";
import path from "path";
import childProcess from "child_process";

// const hookIdentifier = "### gitlint-cli commit-msg hook ###";
const hookSrcPath = path.resolve(__dirname, "../../files/commit-msg");
const hookDestFilename = "commit-msg";

export function installHook(): void {
  const hooksPath = childProcess
    .execSync("git rev-parse --git-path hooks")
    .toString()
    .trim(); // strips newline character
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

export function uninstallHook(): void {}

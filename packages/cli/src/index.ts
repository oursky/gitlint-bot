import yargs, { Argv } from "yargs";
import * as Commands from "./commands";

const blankBuilder = (_: Argv) => {};

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs
  .command(
    "generate-config",
    "Generates a sample config file",
    blankBuilder,
    Commands.generateConfig
  )
  .command(
    "install-hook",
    "Installs gitlint-cli as a git commit-msg hook",
    blankBuilder,
    Commands.installHook
  )
  .command(
    "uninstall-hook",
    "Uninstalls gitlint commit-msg hook",
    blankBuilder,
    Commands.uninstallHook
  )
  .command(
    ["lint", "*"],
    'Lints commits in git repository. Reads last commit message from ".git/COMMIT_EDITMSG" by default',
    {
      config: {
        alias: "c",
        description: "path to config file",
        defaultDescription: ".gitlintrc",
        type: "string",
      },
      from: {
        alias: "f",
        description: "lower end of commit range to lint",
        type: "string",
      },
      to: {
        alias: "t",
        description: "upper end of the commit range to lint",
        type: "string",
      },
      "std-in": {
        alias: "s",
        description: "reads and lints commit message from stdin",
        default: false,
        type: "boolean",
      },
    },
    Commands.lint // eslint-disable-line @typescript-eslint/no-misused-promises
  )
  .usage("Git commit message linter")
  .help("help")
  .alias("h", "help")
  .strict().argv;

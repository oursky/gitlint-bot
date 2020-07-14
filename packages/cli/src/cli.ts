import yargs from "yargs";

const cli = yargs
  .options({
    config: {
      alias: "c",
      description: "path to config file",
      default: ".gitlintrc",
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
    stdin: {
      alias: "s",
      description: "reads and lints commit message from stdin",
      default: false,
      type: "boolean",
    },
  })
  .command("generate-config", "Generates a sample config file")
  .command("install-hook", "Installs gitlint-cli as a git commit-msg hook")
  .command("uninstall-hook", "Uninstalls gitlint commit-msg hook")
  .usage(`Git commit message linter`)
  .help("help")
  .alias("h", "help")
  .strict();

export default cli;

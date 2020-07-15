import cli from "./cli";
import { CliFlags } from "./types";
import * as Commands from "./commands";

main(cli.argv);

function main(flags: CliFlags) {
  const commands = flags._;
  const command = commands[0];
  if (command === "generate-config") {
    Commands.generateConfig();
  } else if (command === "install-hook") {
    Commands.installHook();
  } else if (command === "uninstall-hook") {
    Commands.uninstallHook();
  } else {
    Commands.lint(flags);
  }
}

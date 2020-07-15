import { CliFlags } from "../types";

function lintCommand(flags: CliFlags): void {
  console.log(flags);
}

export default lintCommand;

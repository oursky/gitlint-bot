import cli from "./cli";
import { CliFlags } from "./types";

main(cli.argv);

function main(flags: CliFlags) {
  console.log(flags);
}

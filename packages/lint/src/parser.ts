export { Commit } from "@commitlint/types";
import { Commit } from "@commitlint/types";
import parse from "@commitlint/parse";
import { EffectiveConfig } from "./config";

const blankCommit = {
  raw: "",
  header: "",
  type: null,
  scope: null,
  subject: null,
  body: null,
  footer: null,
  mentions: [],
  notes: [],
  references: [],
  revert: null,
  merge: null,
};

export async function parseCommit(
  commitMessage: string,
  config: EffectiveConfig
): Promise<Commit> {
  // @commitlint/parse parser throws error if commit message is empty
  return commitMessage.trim().length !== 0
    ? parse(
        commitMessage,
        undefined,
        config.headerPattern && { headerPattern: config.headerPattern }
      )
    : blankCommit;
}

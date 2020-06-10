export { Commit } from "@commitlint/parse";
import parse, { Commit } from "@commitlint/parse";

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

export async function parseCommit(commitMessage: string): Promise<Commit> {
  // @commitlint/parse parser throws error if commit message is empty
  return commitMessage.trim().length !== 0
    ? await parse(commitMessage)
    : blankCommit;
}

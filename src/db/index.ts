import { ViolationInfo } from "../lint";
import { CommitUser } from "types/github";
import { createCommitDiagnosis } from "./models/CommitDiagnosis";
import { createCommit, findCommit } from "./models/Commit";
import {
  findUserByEmail,
  findUserByName,
  createUser,
  User,
} from "./models/User";

export interface CommitInfo {
  author: CommitUser;
  commit: {
    id: string;
    message: string;
    score: number;
    timestamp: string;
    violations: ViolationInfo[];
  };
}

async function findOrCreateUser(user: CommitUser): Promise<User> {
  const existingUser =
    (await findUserByName(user.name)) ?? (await findUserByEmail(user.email));
  if (!existingUser) {
    return createUser({
      email: user.email,
      name: user.name,
    });
  }
  return existingUser;
}

export async function saveCommit(commitInfo: CommitInfo): Promise<void> {
  const commitExists = await findCommit(commitInfo.commit.id);
  if (!!commitExists) {
    return;
  }
  const user = await findOrCreateUser(commitInfo.author);

  const { id, message, score, timestamp, violations } = commitInfo.commit;
  const commit = await createCommit({
    id,
    user_id: user.id,
    committed_at: timestamp,
    score,
    message,
  });
  await Promise.all(
    violations.map(async (violation) =>
      createCommitDiagnosis({
        commit_id: commit.id,
        rule: violation.ruleName,
        data: violation.violation,
      })
    )
  );
}

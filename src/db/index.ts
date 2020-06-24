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
import * as Knex from "knex";
import db from "./db";
import Sentry, { addInvocationBreadcrumb } from "../sentry";

export interface CommitInfo {
  author: CommitUser;
  repoName: string;
  commit: {
    id: string;
    message: string;
    score: number;
    timestamp: string;
    violations: ViolationInfo[];
    url: string;
  };
}

async function findOrCreateUser(user: CommitUser, trx: Knex): Promise<User> {
  const existingUser =
    (await findUserByName(user.name, trx)) ??
    (await findUserByEmail(user.email, trx));
  if (!existingUser) {
    return createUser(
      {
        email: user.email,
        name: user.name,
      },
      trx
    );
  }
  return existingUser;
}

export async function saveCommit(commitInfo: CommitInfo): Promise<void> {
  try {
    addInvocationBreadcrumb("'saveCommit' function");
    await db.transaction(async (trx) => {
      const commitExists = await findCommit(commitInfo.commit.id, trx);
      if (!!commitExists) {
        return;
      }
      const user = await findOrCreateUser(commitInfo.author, trx);

      const {
        id,
        message,
        score,
        timestamp,
        violations,
        url,
      } = commitInfo.commit;
      const commit = await createCommit(
        {
          id,
          user_id: user.id,
          committed_at: timestamp,
          score,
          message,
          url,
          repo_name: commitInfo.repoName,
        },
        trx
      );
      for (const violation of violations) {
        await createCommitDiagnosis(
          {
            commit_id: commit.id,
            rule: violation.ruleName,
            data: violation.violation,
          },
          trx
        );
      }
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}

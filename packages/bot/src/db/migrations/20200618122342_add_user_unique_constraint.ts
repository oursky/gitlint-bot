import * as Knex from "knex";
import { User } from "../models/User";
import { Commit } from "../models/Commit";

async function getUniqueUserIds(knex: Knex): Promise<number[]> {
  const users = await knex
    .from("user")
    .select<Pick<User, "id">[]>("id")
    .distinctOn(["name", "email"])
    .orderBy(["name", "email", "id"]);
  return users.map((user) => user.id);
}

async function getCommitsWithDupeUser(
  knex: Knex,
  uniqueUserIds: number[]
): Promise<Pick<Commit, "id" | "user_id">[]> {
  return knex
    .select<Pick<Commit, "id" | "user_id">[]>(["id", "user_id"])
    .from("commit")
    .whereNotIn("user_id", uniqueUserIds);
}

async function getUniqueUserMatchingId(knex: Knex, dupeUserId: number) {
  const user = await knex
    .select<Pick<User, "id">[]>("t1.id")
    .from("user as t1")
    .innerJoin("user as t2", function () {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.on("t1.name", "=", "t2.name").andOn("t1.email", "=", "t2.email");
    })
    .distinctOn(["t1.name", "t1.email"])
    .where("t2.id", "=", dupeUserId)
    .orderBy(["t1.name", "t1.email", "t1.id"])
    .first();
  if (!user) {
    throw new Error("No unique user matching ID");
  }
  return user;
}

function updateCommitUserId(knex: Knex, commitId: string, userId: number) {
  return knex
    .from("commit")
    .update({
      user_id: userId,
    })
    .where("commit.id", "=", commitId);
}

export async function up(knex: Knex): Promise<void> {
  const uniqueUserIds = await getUniqueUserIds(knex);
  const invalidCommits = await getCommitsWithDupeUser(knex, uniqueUserIds);

  for (const invalidCommit of invalidCommits) {
    const uniqueUser = await getUniqueUserMatchingId(
      knex,
      invalidCommit.user_id
    );
    await updateCommitUserId(knex, invalidCommit.id, uniqueUser.id);
  }
  await knex.del().from("user").whereNotIn("id", uniqueUserIds);

  return knex.schema.table("user", (builder) => {
    builder.unique(["name", "email"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("user", (builder) => {
    builder.dropUnique(["name", "email"]);
  });
}

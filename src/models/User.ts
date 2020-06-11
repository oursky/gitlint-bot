import db from "../db";

const tableName = "user";

export interface UserModel {
  id: number;
  name: string;
}

export async function findOrCreateUser(
  name: string
): Promise<UserModel | undefined> {
  return (await findUser(name)) ?? (await createUser(name));
}

export async function findUser(name: string): Promise<UserModel | undefined> {
  return db(tableName).where<UserModel>("name", name).first();
}

export async function createUser(name: string): Promise<UserModel | undefined> {
  return db(tableName).returning("*").insert({
    name,
  });
}

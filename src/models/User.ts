import db from "../db";

const tableName = "user";

export interface User {
  id: number;
  name: string;
}

export async function findOrCreateUser(name: string): Promise<User> {
  return (await findUser(name)) ?? (await createUser(name));
}

export async function findUser(name: string): Promise<User | undefined> {
  return db(tableName).where<User>("name", name).first();
}

export async function createUser(name: string): Promise<User> {
  return db(tableName).returning("*").insert({
    name,
  });
}

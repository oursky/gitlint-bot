import db from "..";

const tableName = "user";

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function findUserByName(name: string): Promise<User | undefined> {
  return db(tableName).where<User>("name", name).first();
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  return db(tableName).where<User>("email", email).first();
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  return db(tableName).returning("*").insert(user);
}

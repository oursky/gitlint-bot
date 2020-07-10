import * as Knex from "knex";
import db from "../db";

const tableName = "user";

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function findUserByName(
  name: string,
  client: Knex = db
): Promise<User | undefined> {
  return client(tableName).where<User>("name", name).first();
}

export async function findUserByEmail(
  email: string,
  client: Knex = db
): Promise<User | undefined> {
  return client(tableName).where<User>("email", email).first();
}

export async function createUser(
  user: Omit<User, "id">,
  client: Knex = db
): Promise<User> {
  const users = await client(tableName).returning("*").insert<User[]>([user]);
  return users[0];
}

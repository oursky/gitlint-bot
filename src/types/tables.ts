export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Commit {
  id: number;
  userId: number;
  message: string;
  created_at: Date;
}

export interface CommitError {
  id: number;
  commitId: number;
  rule: string;
  message: string;
}

export interface User {
  id: number;
  name: string;
}

export interface Commit {
  id: number;
  user_id: number;
  message: string;
  committed_at: Date;
}

export interface CommitResult {
  id: number;
  commit_id: number;
  rule: string;
  message: string;
}

export interface User {
  id: number;
  name: string;
}

export interface Commit {
  id: string;
  user_id: number;
  message: string;
  committed_at: Date;
}

export interface CommitDiagnosis {
  id: number;
  commit_id: string;
  rule: string;
  message: string;
}

export interface CommitUser {
  name: string;
  email: string;
  username: string;
}

export interface Commit {
  id: string;
  message: string;
  timestamp: string;
  author: CommitUser;
  committer: CommitUser;
  distinct: boolean;
  added: string[];
  removed: string[];
  modified: string[];
}

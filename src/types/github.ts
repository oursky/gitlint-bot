// Github Webhook event payloads can be found here:
// https://developer.github.com/webhooks/event-payloads/
// NOTE: Documentation seems to be a bit outdated and does not
// always accurately reflect payloads

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

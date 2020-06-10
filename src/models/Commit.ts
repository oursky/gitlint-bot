export interface CommitModel {
  id: string;
  user_id: number;
  score: number;
  message: string;
  committed_at: Date;
}

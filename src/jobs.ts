import { sendSlackSummary } from "./slack";

export async function slackJob(): Promise<void> {
  await sendSlackSummary();
}

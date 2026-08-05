import type { ChatMessage } from "./types";

const isDeferredResult = (message: ChatMessage) =>
  message.kind === "execution" || message.kind === "viewer-preview";

function orderTurn(messages: readonly ChatMessage[]): ChatMessage[] {
  const activity = messages.filter((message) => message.kind === "ai-activity");
  const result = messages.filter(isDeferredResult);
  const userMessages = messages.filter((message) => message.role === "user");
  const conversation = messages.filter((message) =>
    message.role !== "user" &&
    message.kind !== "ai-activity" && !isDeferredResult(message)
  );
  const unfinished = activity.some((message) =>
    !["completed", "failed", "stopped"].includes(
      message.aiActivity?.state || "completed"
    )
  );
  return [...userMessages, ...activity, ...conversation, ...(unfinished ? [] : result)];
}

/** Keep the final Assistant response ahead of its local validation results. */
export function chatMessagesForPresentation(
  messages: readonly ChatMessage[]
): ChatMessage[] {
  const ordered: ChatMessage[] = [];
  let turn: ChatMessage[] = [];
  for (const message of messages) {
    if (message.role === "user" && turn.length) {
      ordered.push(...orderTurn(turn));
      turn = [];
    }
    turn.push(message);
  }
  ordered.push(...orderTurn(turn));
  return ordered;
}

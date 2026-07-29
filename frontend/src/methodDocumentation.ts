import type { ChatRecord } from "./types";

export function assistantSummaryForPrompt(
  chat: ChatRecord | undefined,
  promptId: string
): string {
  if (!chat) return "";
  const promptIndex = chat.messages.findIndex((message) => message.id === promptId);
  if (promptIndex < 0) return "";
  const turn = chat.messages
    .slice(promptIndex + 1)
    .slice(0, chat.messages.slice(promptIndex + 1)
      .findIndex((message) => message.role === "user") < 0
      ? undefined
      : chat.messages.slice(promptIndex + 1)
        .findIndex((message) => message.role === "user"));
  return turn
    .filter((message) =>
      message.role === "assistant" &&
      message.kind !== "execution" &&
      message.kind !== "viewer-preview" &&
      message.kind !== "error" &&
      message.content.trim()
    )
    .at(-1)?.content.trim() || "";
}

export function withAssistantSummaryComments(code: string, summary: string): string {
  const cleanCode = code.trim();
  const cleanSummary = summary.trim();
  if (!cleanSummary) return cleanCode;
  const comments = cleanSummary
    .split(/\r?\n/)
    .map((line) => line ? `# ${line}` : "#")
    .join("\n");
  return [
    "# Assistant summary generated after this analysis completed:",
    comments,
    "",
    cleanCode
  ].join("\n");
}

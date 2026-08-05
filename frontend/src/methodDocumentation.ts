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
  const finalResponse = turn
    .filter((message) =>
      message.role === "assistant" &&
      message.kind !== "execution" &&
      message.kind !== "viewer-preview" &&
      message.kind !== "error" &&
      message.content.trim()
    )
    .at(-1)?.content.trim() || "";
  return finalResponse
    .replace(/```(?:python|py)\s+[\s\S]*?```/gi, "")
    .trim();
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

const SUMMARY_MARKER = "# Assistant summary generated after this analysis completed:";

export function splitAssistantDocumentation(code: string): {
  narrative: string;
  source: string;
} {
  const lines = code.replace(/\r\n/g, "\n").split("\n");
  if (lines[0]?.trim() !== SUMMARY_MARKER) {
    return { narrative: "", source: code.trim() };
  }
  const narrative: string[] = [];
  let index = 1;
  while (index < lines.length && /^#(?:\s|$)/.test(lines[index])) {
    narrative.push(lines[index].replace(/^# ?/, ""));
    index += 1;
  }
  while (index < lines.length && !lines[index].trim()) index += 1;
  return {
    narrative: narrative.join("\n").trim(),
    source: lines.slice(index).join("\n").trim()
  };
}

import type { ChatMessage, ChatRecord } from "./types";

export function activityTranscriptMarkdown(message: ChatMessage): string[] {
  const activity = message.aiActivity;
  if (!activity) return [];
  const lines = [
    "## AI activity",
    "",
    `State: ${activity.state}`,
    ""
  ];
  for (const entry of activity.entries) {
    lines.push(`- **${entry.label}** — ${entry.status}`);
    if (entry.detail) lines.push("", entry.detail, "");
  }
  if (activity.question) {
    lines.push("", `**Question:** ${activity.question.prompt}`, "");
    if (activity.question.answer) {
      lines.push(`**Answer:** ${activity.question.answer}`, "");
    }
  }
  return lines;
}

export function chatTranscriptMarkdown(
  chat: ChatRecord,
  options: { includeActivity?: boolean } = {}
): string {
  const lines = [`# ${chat.title}`, "", `Updated: ${chat.updatedAt}`, ""];
  if (chat.summary) lines.push("## Conversation summary", "", chat.summary, "");
  for (const message of chat.messages) {
    if (message.kind === "execution") continue;
    if (message.kind === "ai-activity") {
      if (options.includeActivity !== false) lines.push(...activityTranscriptMarkdown(message));
      continue;
    }
    lines.push(
      `## ${message.role === "user" ? "User" : "Assistant"}`,
      "",
      message.content,
      ""
    );
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

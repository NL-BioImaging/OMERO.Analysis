import type { ChatRecord } from "./types";

export function shouldAutoTitleChat(chat: ChatRecord): boolean {
  return !chat.titleEdited && !chat.messages.some((message) => message.role === "user");
}

export function manuallyNamedChat(
  chat: ChatRecord,
  title: string,
  updatedAt: string
): ChatRecord {
  return {
    ...chat,
    title: title.slice(0, 100),
    titleEdited: true,
    updatedAt
  };
}

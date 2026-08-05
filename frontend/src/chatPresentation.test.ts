import { chatMessagesForPresentation } from "./chatPresentation";
import type { ChatMessage } from "./types";

const message = (
  id: string,
  role: ChatMessage["role"],
  kind: ChatMessage["kind"],
  state?: "responding" | "completed"
): ChatMessage => ({
  id,
  role,
  kind,
  content: id,
  aiActivity: kind === "ai-activity" ? {
    promptId: "user",
    state: state || "completed",
    entries: [],
    startedAt: "2026-08-05T00:00:00Z"
  } : undefined,
  createdAt: "2026-08-05T00:00:00Z"
});

describe("Assistant chat presentation", () => {
  it("places the final response before local results", () => {
    const messages = [
      message("user", "user", "text"),
      message("activity", "assistant", "ai-activity", "completed"),
      message("analysis", "assistant", "execution"),
      message("answer", "assistant", "text")
    ];
    expect(chatMessagesForPresentation(messages).map((item) => item.id))
      .toEqual(["user", "activity", "answer", "analysis"]);
  });

  it("withholds local results until the Assistant is finished", () => {
    const messages = [
      message("user", "user", "text"),
      message("activity", "assistant", "ai-activity", "responding"),
      message("analysis", "assistant", "execution")
    ];
    expect(chatMessagesForPresentation(messages).map((item) => item.id))
      .toEqual(["user", "activity"]);
  });
});

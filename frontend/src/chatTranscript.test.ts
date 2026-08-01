import { chatTranscriptMarkdown } from "./chatTranscript";
import type { ChatRecord } from "./types";

it("renders one canonical transcript including AI activity", () => {
  const chat: ChatRecord = {
    id: "chat", workspaceId: "workspace", title: "Analysis", summary: "Earlier work",
    messages: [{
      id: "user", role: "user", content: "Question", createdAt: "2026-01-01"
    }, {
      id: "activity", role: "assistant", content: "", kind: "ai-activity",
      aiActivity: {
        promptId: "user", state: "completed", startedAt: "2026-01-01",
        entries: [{
          id: "entry", kind: "status", label: "Prepared", status: "completed",
          createdAt: "2026-01-01"
        }]
      }, createdAt: "2026-01-01"
    }, {
      id: "assistant", role: "assistant", content: "**Answer**", createdAt: "2026-01-01"
    }],
    createdAt: "2026-01-01", updatedAt: "2026-01-02"
  };
  const markdown = chatTranscriptMarkdown(chat);
  expect(markdown).toContain("## Conversation summary");
  expect(markdown).toContain("## AI activity");
  expect(markdown).toContain("## Assistant\n\n**Answer**");
  expect(markdown.endsWith("\n")).toBe(true);
});

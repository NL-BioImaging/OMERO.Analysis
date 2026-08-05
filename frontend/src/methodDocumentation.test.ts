import { describe, expect, it } from "vitest";
import type { ChatRecord } from "./types";
import {
  assistantSummaryForPrompt,
  splitAssistantDocumentation,
  withAssistantSummaryComments
} from "./methodDocumentation";

const chat: ChatRecord = {
  id: "chat",
  workspaceId: "workspace",
  title: "Analysis",
  summary: "",
  pinnedMessageIds: [],
  messages: [{
    id: "prompt",
    role: "user",
    content: "Make a plot",
    createdAt: "2026-07-29T00:00:00Z"
  }, {
    id: "execution",
    role: "assistant",
    content: "Ran Python",
    kind: "execution",
    createdAt: "2026-07-29T00:00:01Z"
  }, {
    id: "answer",
    role: "assistant",
    content: "The treated wells contain fewer cells.\nThe plot shows the difference.",
    createdAt: "2026-07-29T00:00:02Z"
  }, {
    id: "next",
    role: "user",
    content: "Continue",
    createdAt: "2026-07-29T00:00:03Z"
  }, {
    id: "later",
    role: "assistant",
    content: "This belongs to the next turn.",
    createdAt: "2026-07-29T00:00:04Z"
  }],
  createdAt: "2026-07-29T00:00:00Z",
  updatedAt: "2026-07-29T00:00:04Z"
};

describe("saved Method documentation", () => {
  it("selects the final assistant summary from the matching Chat turn", () => {
    expect(assistantSummaryForPrompt(chat, "prompt")).toBe(
      "The treated wells contain fewer cells.\nThe plot shows the difference."
    );
  });

  it("adds the assistant output as valid Python comments", () => {
    expect(withAssistantSummaryComments("result = 1", "Line one\n\nLine two")).toBe(
      "# Assistant summary generated after this analysis completed:\n" +
      "# Line one\n#\n# Line two\n\nresult = 1"
    );
  });

  it("keeps the narrative but omits the fenced Method from saved comments", () => {
    const withMethod: ChatRecord = {
      ...chat,
      messages: chat.messages.map((message) => message.id === "answer"
        ? {
          ...message,
          content: "## Summary\nCreated the plot.\n\n```python\nresult = 1\n```"
        }
        : message)
    };
    expect(assistantSummaryForPrompt(withMethod, "prompt")).toBe(
      "## Summary\nCreated the plot."
    );
  });

  it("separates the Assistant narrative from reusable Method source", () => {
    const documented = withAssistantSummaryComments(
      "import pandas as pd\nresult = pd.DataFrame()",
      "## Summary\nCreated a table.\n\n## Review\nValidated locally.\n\n## Recommendations\nInspect the rows."
    );
    expect(splitAssistantDocumentation(documented)).toEqual({
      narrative: "## Summary\nCreated a table.\n\n## Review\nValidated locally.\n\n## Recommendations\nInspect the rows.",
      source: "import pandas as pd\nresult = pd.DataFrame()"
    });
  });
});

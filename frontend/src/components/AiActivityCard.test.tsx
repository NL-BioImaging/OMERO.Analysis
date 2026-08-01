import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import type { ChatMessage } from "../types";
import { AiActivityCard } from "./AiActivityCard";

function activityMessage(overrides: Partial<NonNullable<ChatMessage["aiActivity"]>> = {}): ChatMessage {
  return {
    id: "activity",
    role: "assistant",
    content: "",
    kind: "ai-activity",
    createdAt: "2026-08-01T12:00:00Z",
    aiActivity: {
      promptId: "prompt",
      state: "responding",
      startedAt: "2026-08-01T12:00:00Z",
      entries: [{
        id: "prepare",
        kind: "status",
        label: "Preparing the analysis context",
        status: "completed",
        createdAt: "2026-08-01T12:00:00Z",
        completedAt: "2026-08-01T12:00:01Z"
      }],
      ...overrides
    }
  };
}

describe("AiActivityCard", () => {
  it("is collapsed by default and reveals the live progress transcript", () => {
    const { container } = render(
      <AiActivityCard
        message={activityMessage()}
        liveText="Reviewing the table"
        questionActive={false}
        onAnswer={vi.fn()}
      />
    );

    expect(container.querySelector("details")).not.toHaveAttribute("open");
    fireEvent.click(screen.getByText("AI activity"));
    expect(container.querySelector("details")).toHaveAttribute("open");
    expect(screen.getByText("Reviewing the table")).toBeInTheDocument();
    expect(screen.getByText(/Private model chain-of-thought is not displayed/)).toBeInTheDocument();
  });

  it("opens a blocking question automatically and returns the selected choice", () => {
    const onAnswer = vi.fn();
    const message = activityMessage({
      state: "waiting",
      question: {
        id: "question",
        prompt: "Which grouping should be used?",
        choices: ["Per well", "Per plate"],
        allowOther: true
      }
    });
    const { container } = render(
      <AiActivityCard
        message={message}
        liveText=""
        questionActive
        onAnswer={onAnswer}
      />
    );

    expect(container.querySelector("details")).toHaveAttribute("open");
    fireEvent.click(screen.getByRole("button", { name: "Per well" }));
    expect(onAnswer).toHaveBeenCalledWith(message, "Per well");
  });

  it("does not accept answers for a question restored without a live AI turn", () => {
    const message = activityMessage({
      state: "waiting",
      question: {
        id: "stale-question",
        prompt: "Choose one",
        choices: ["A", "B"],
        allowOther: false
      }
    });
    render(
      <AiActivityCard
        message={message}
        liveText=""
        questionActive={false}
        onAnswer={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "A" })).toBeDisabled();
    expect(screen.getByText(/no longer active/i)).toBeInTheDocument();
  });

  it("presents failed attempts as collapsed, recoverable retries", () => {
    const { container } = render(
      <AiActivityCard
        message={activityMessage({
          entries: [{
            id: "python",
            kind: "tool",
            label: "Running local Python analysis",
            detail: "PythonError: internal traceback",
            status: "failed",
            createdAt: "2026-08-01T12:00:00Z",
            completedAt: "2026-08-01T12:00:01Z"
          }]
        })}
        liveText=""
        questionActive={false}
        onAnswer={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("AI activity"));
    expect(screen.getByText(/adjusting and retrying/i)).toBeInTheDocument();
    expect(screen.getByText("Show technical details").closest("details"))
      .not.toHaveAttribute("open");
    expect(container.querySelector(".action-icon-sync")).toBeInTheDocument();
  });

  it("keeps the duplicated final response collapsed", () => {
    render(
      <AiActivityCard
        message={activityMessage({
          entries: [{
            id: "final",
            kind: "message",
            label: "Final response",
            detail: "## Result\n\nFinished",
            status: "completed",
            createdAt: "2026-08-01T12:00:00Z",
            completedAt: "2026-08-01T12:00:01Z"
          }]
        })}
        liveText=""
        questionActive={false}
        onAnswer={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("AI activity"));
    expect(screen.getByText("Show final response").closest("details"))
      .not.toHaveAttribute("open");
  });
});

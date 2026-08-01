import { useEffect, useState } from "react";
import type { ChatMessage } from "../types";
import { ActionIcon } from "./ActionIcon";
import { Button, Input } from "./BlueprintControls";
import { MarkdownPreview } from "./WorkspacePanels";

const STATE_LABELS = {
  preparing: "Preparing",
  responding: "AI responding",
  running: "Running analysis",
  checking: "Checking results",
  waiting: "Waiting for your answer",
  completed: "Completed",
  failed: "Stopped with an error",
  stopped: "Stopped"
} as const;

export function AiActivityCard({
  message,
  liveText,
  questionActive,
  onAnswer
}: {
  message: ChatMessage;
  liveText: string;
  questionActive: boolean;
  onAnswer: (message: ChatMessage, answer: string) => void;
}) {
  const activity = message.aiActivity;
  const pendingQuestion = Boolean(activity?.question && !activity.question.answer);
  const [expanded, setExpanded] = useState(pendingQuestion);
  const [otherAnswer, setOtherAnswer] = useState("");

  useEffect(() => {
    if (pendingQuestion) setExpanded(true);
  }, [pendingQuestion, activity?.question?.id]);

  if (!activity) return null;
  const stateLabel = STATE_LABELS[activity.state];
  const completedCount = activity.entries.filter((entry) => entry.status === "completed").length;
  return (
    <article className={`message ai-activity-card ${activity.state}`}>
      <details
        open={expanded}
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <summary>
          <span className="ai-activity-title">
            <ActionIcon name={activity.state === "completed" ? "success" : "run"} />
            AI activity
          </span>
          <span className="ai-activity-state">
            {stateLabel}{completedCount ? ` · ${completedCount} step${completedCount === 1 ? "" : "s"}` : ""}
          </span>
        </summary>
        <div className="ai-activity-body">
          <p className="ai-activity-privacy">
            This is a user-facing progress transcript. Private model chain-of-thought is not displayed or stored.
          </p>
          <ol className="ai-activity-log">
            {activity.entries.map((entry) => {
              const finalResponse = entry.kind === "message" && entry.label === "Final response";
              const recoverableFailure = entry.status === "failed" && entry.kind === "tool";
              const collapsedDetail = Boolean(entry.detail && (entry.status === "failed" || finalResponse));
              return (
                <li className={entry.status} key={entry.id}>
                  <span className="ai-activity-marker" aria-hidden="true">
                    {entry.status === "active"
                      ? "◷"
                      : recoverableFailure
                        ? <ActionIcon name="sync" />
                        : entry.status === "failed"
                          ? "○"
                        : "✓"}
                  </span>
                  <div>
                    <strong>{recoverableFailure
                      ? `${entry.label} — adjusting and retrying`
                      : entry.label}</strong>
                    {collapsedDetail ? (
                      <details className="ai-entry-detail">
                        <summary>{finalResponse ? "Show final response" : "Show technical details"}</summary>
                        {finalResponse
                          ? <MarkdownPreview markdown={entry.detail || ""} />
                          : <pre>{entry.detail}</pre>}
                      </details>
                    ) : entry.detail && (entry.kind === "message"
                      ? <MarkdownPreview markdown={entry.detail} />
                      : <p>{entry.detail}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          {liveText && (
            <section className="ai-live-response" aria-live="polite">
              <strong>Live response</strong>
              <p>{liveText}<i className="stream-caret" /></p>
            </section>
          )}
          {activity.question && (
            <section className="ai-question" aria-live="assertive">
              <strong>Question from the assistant</strong>
              <p>{activity.question.prompt}</p>
              <div className="ai-question-choices">
                {activity.question.choices.map((choice) => (
                  <Button
                    key={choice}
                    disabled={Boolean(activity.question?.answer) || !questionActive}
                    onClick={() => onAnswer(message, choice)}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
              {activity.question.allowOther && !activity.question.answer && questionActive && (
                <form
                  className="ai-question-other"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const answer = otherAnswer.trim();
                    if (answer) onAnswer(message, answer);
                  }}
                >
                  <Input
                    aria-label="Another answer"
                    placeholder="Another answer…"
                    value={otherAnswer}
                    onChange={(event) => setOtherAnswer(event.target.value)}
                  />
                  <Button disabled={!otherAnswer.trim()} type="submit">Submit</Button>
                </form>
              )}
              {activity.question.answer && (
                <p className="ai-question-answer"><strong>Your answer:</strong> {activity.question.answer}</p>
              )}
              {!activity.question.answer && !questionActive && (
                <p className="ai-question-answer">
                  This question is no longer active. Send your answer as a new chat message.
                </p>
              )}
            </section>
          )}
        </div>
      </details>
    </article>
  );
}

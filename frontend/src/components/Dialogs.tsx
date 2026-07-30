import { useRef, useState, type ReactNode } from "react";
import { Button, Input } from "./BlueprintControls";

interface DialogState {
  title: string;
  description?: string;
  value?: string;
  confirmLabel: string;
  danger?: boolean;
  choices?: Array<{ value: string; label: string; description?: string }>;
  mode: "text" | "confirm" | "choose";
}

export interface DialogController {
  askText: (title: string, value?: string, description?: string) => Promise<string | null>;
  confirm: (
    title: string,
    description: string,
    confirmLabel?: string,
    danger?: boolean
  ) => Promise<boolean>;
  choose: (
    title: string,
    choices: Array<{ value: string; label: string; description?: string }>,
    description?: string
  ) => Promise<string | null>;
  element: ReactNode;
}

export function useDialogs(): DialogController {
  const [state, setState] = useState<DialogState | null>(null);
  const [value, setValue] = useState("");
  const resolver = useRef<((value: string | boolean | null) => void) | null>(null);

  const close = (result: string | boolean | null) => {
    resolver.current?.(result);
    resolver.current = null;
    setState(null);
  };

  const askText = (title: string, initial = "", description?: string) =>
    new Promise<string | null>((resolve) => {
      resolver.current = resolve as (value: string | boolean | null) => void;
      setValue(initial);
      setState({ title, description, value: initial, confirmLabel: "Save", mode: "text" });
    });

  const confirm = (
    title: string,
    description: string,
    confirmLabel = "Continue",
    danger = false
  ) => new Promise<boolean>((resolve) => {
    resolver.current = resolve as (value: string | boolean | null) => void;
    setState({ title, description, confirmLabel, danger, mode: "confirm" });
  });

  const choose = (
    title: string,
    choices: Array<{ value: string; label: string; description?: string }>,
    description?: string
  ) => new Promise<string | null>((resolve) => {
    resolver.current = resolve as (value: string | boolean | null) => void;
    setValue(choices[0]?.value || "");
    setState({
      title,
      description,
      choices,
      confirmLabel: "Use selected object",
      mode: "choose"
    });
  });

  const element = state ? (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close(state.mode === "confirm" ? false : null);
      }}
    >
      <form
        className="app-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-dialog-title"
        onSubmit={(event) => {
          event.preventDefault();
          close(
            state.mode === "text"
              ? value.trim() || null
              : state.mode === "choose"
                ? value || null
                : true
          );
        }}
      >
        <h2 id="app-dialog-title">{state.title}</h2>
        {state.description && <p>{state.description}</p>}
        {state.mode === "text" && (
          <label>
            <span>Name</span>
            <Input
              autoFocus
              value={value}
              maxLength={180}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>
        )}
        {state.mode === "choose" && (
          <label>
            <span>OMERO object</span>
            <select
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
            >
              {(state.choices || []).map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}{choice.description ? ` — ${choice.description}` : ""}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="dialog-actions">
          <Button type="button" onClick={() => close(state.mode === "confirm" ? false : null)}>
            Cancel
          </Button>
          <Button className={state.danger ? "danger-button" : ""} type="submit">
            {state.confirmLabel}
          </Button>
        </div>
      </form>
    </div>
  ) : null;

  return { askText, confirm, choose, element };
}

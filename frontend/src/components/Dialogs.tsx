import { useRef, useState, type ReactNode } from "react";
import { Button, Input } from "./BlueprintControls";

interface DialogState {
  title: string;
  description?: string;
  value?: string;
  selected?: string[];
  confirmLabel: string;
  danger?: boolean;
  choices?: Array<{ value: string; label: string; description?: string }>;
  mode: "text" | "confirm" | "choose" | "multiple" | "alert";
}

export interface DialogController {
  askText: (title: string, value?: string, description?: string) => Promise<string | null>;
  confirm: (
    title: string,
    description: string,
    confirmLabel?: string,
    danger?: boolean
  ) => Promise<boolean>;
  alert: (title: string, description: string) => Promise<void>;
  choose: (
    title: string,
    choices: Array<{ value: string; label: string; description?: string }>,
    description?: string
  ) => Promise<string | null>;
  chooseMany: (title: string, choices: Array<{ value: string; label: string; description?: string }>, selected?: string[], description?: string) => Promise<string[] | null>;
  element: ReactNode;
}

export function useDialogs(): DialogController {
  const [state, setState] = useState<DialogState | null>(null);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const resolver = useRef<((value: any) => void) | null>(null);

  const close = (result: string | boolean | string[] | null) => {
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

  const chooseMany: DialogController["chooseMany"] = (title, choices, initial = [], description) =>
    new Promise(resolve => {
      resolver.current = resolve;
      setSelected(initial);
      setState({title, choices, description, confirmLabel: "Use selected images", mode: "multiple"});
    });

  const alert = (title: string, description: string) =>
    new Promise<void>((resolve) => {
      resolver.current = () => resolve();
      setState({ title, description, confirmLabel: "Close", mode: "alert" });
    });

  const element = state ? (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          close(state.mode === "confirm" ? false : null);
        }
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
              : state.mode === "multiple" ? selected
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
        {state.mode === "multiple" && <div style={{maxHeight: "55vh", overflowY: "auto"}}>
          {(state.choices || []).map(choice => <label key={choice.value} style={{display: "flex", gap: "0.6em", marginBottom: "0.6em"}}>
            <input type="checkbox" checked={selected.includes(choice.value)} onChange={event => setSelected(current => event.target.checked ? [...current, choice.value] : current.filter(value => value !== choice.value))} />
            <span>{choice.label}{choice.description && <small> — {choice.description}</small>}</span>
          </label>)}
          {!state.choices?.length && <p>No images or plates are available in this source.</p>}
        </div>}
        <div className="dialog-actions">
          {state.mode !== "alert" && (
            <Button type="button" onClick={() => close(state.mode === "confirm" ? false : null)}>
              Cancel
            </Button>
          )}
          <Button className={state.danger ? "danger-button" : ""} type="submit">
            {state.confirmLabel}
          </Button>
        </div>
      </form>
    </div>
  ) : null;

  return { askText, confirm, alert, choose, chooseMany, element };
}

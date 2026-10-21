import { ActionIcon } from "./ActionIcon";
import {
  Button as BlueprintButton,
  Classes,
  Icon,
  type ButtonProps as BlueprintButtonProps
} from "@blueprintjs/core";
import {
  Children,
  isValidElement,
  createContext,
  useContext,
  useEffect,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type PropsWithChildren,
  type TextareaHTMLAttributes
} from "react";

export type UiTheme = "dark" | "light";

const BlueprintThemeContext = createContext<UiTheme>("light");

export function BlueprintThemeProvider({
  theme,
  children
}: PropsWithChildren<{ theme: UiTheme }>) {
  useEffect(() => {
    document.body.classList.toggle(Classes.DARK, theme === "dark");
    return () => document.body.classList.remove(Classes.DARK);
  }, [theme]);
  return (
    <BlueprintThemeContext.Provider value={theme}>
      {children}
    </BlueprintThemeContext.Provider>
  );
}

function buttonText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(buttonText).join(" ");
  if (isValidElement(value)) return buttonText((value.props as {children?: unknown}).children);
  return "";
}
export function buttonIcon(label: string): BlueprintButtonProps["icon"] {
  const text = label.toLowerCase();
  const rules: [RegExp, BlueprintButtonProps["icon"]][] = [
    [/zoom out/, "zoom-out"], [/zoom in/, "zoom-in"], [/history/, "history"], [/compatibility|check/, "tick"], [/publish|share/, "share"],
    [/help/, "help"], [/upload|import|attach/, "upload"], [/download|export/, "download"],
    [/rename|edit/, "edit"], [/restart|reload|refresh|retry|reset/, "refresh"], [/undo|restore/, "undo"],
    [/delete|remove|trash/, "trash"], [/run|play/, "play"], [/stop|cancel/, "stop"], [/clear|close/, "cross"],
    [/new|add|^\+$/, "plus"], [/^−$/, "minus"], [/diagram|summary|summarize/, "graph"],
    [/copy/, "clipboard"], [/preview|view|browse/, "eye-open"], [/bundle|zip/, "compressed"],
    [/previous|back|up/, "chevron-left"], [/next|down/, "chevron-right"], [/sql|source/, "code"],
    [/save|apply/, "floppy-disk"], [/notebook|cells/, "manual"], [/light|dark|theme/, "contrast"],
  ];
  return rules.find(([pattern]) => pattern.test(text))?.[1] || "chevron-right";
}
export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & {icon?: BlueprintButtonProps["icon"] | false}) {
  useContext(BlueprintThemeContext);
  const hasIcon = Children.toArray(props.children).some(child => isValidElement(child) &&
    (child.type === ActionIcon || child.type === Icon || child.type === "svg"));
  const label = props["aria-label"] || props.title || buttonText(props.children);
  return <BlueprintButton {...props as BlueprintButtonProps} icon={props.icon === false ? undefined : props.icon || (hasIcon ? undefined : buttonIcon(label))} />;
}

/**
 * Blueprint's input class is safe on the existing native element and avoids
 * the extra wrapper introduced by InputGroup, which would alter layout.
 */
export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  useContext(BlueprintThemeContext);
  const classes = `${Classes.INPUT}${className ? ` ${className}` : ""}`;
  return <input className={classes} {...props} />;
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  useContext(BlueprintThemeContext);
  const classes = `${Classes.INPUT}${className ? ` ${className}` : ""}`;
  return <textarea className={classes} {...props} />;
}

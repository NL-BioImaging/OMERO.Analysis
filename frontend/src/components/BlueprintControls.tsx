import {
  Button as BlueprintButton,
  Classes,
  type ButtonProps as BlueprintButtonProps
} from "@blueprintjs/core";
import {
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

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  useContext(BlueprintThemeContext);
  return <BlueprintButton {...props as BlueprintButtonProps} />;
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

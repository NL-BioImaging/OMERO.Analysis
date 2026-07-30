import {
  Button as BlueprintButton,
  Classes,
  type ButtonProps as BlueprintButtonProps
} from "@blueprintjs/core";
import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type PropsWithChildren,
  type TextareaHTMLAttributes
} from "react";

export type UiTheme = "dark" | "light";

const BlueprintThemeContext = createContext<UiTheme>("dark");

export function BlueprintThemeProvider({
  theme,
  children
}: PropsWithChildren<{ theme: UiTheme }>) {
  return (
    <BlueprintThemeContext.Provider value={theme}>
      {children}
    </BlueprintThemeContext.Provider>
  );
}

/**
 * Uses Blueprint's real Button component in the BIOMERO-style light theme.
 * Dark mode deliberately keeps the existing native element and CSS so its
 * established layout and presentation remain unchanged.
 */
export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const theme = useContext(BlueprintThemeContext);
  if (theme === "dark") return <button {...props} />;
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
  const theme = useContext(BlueprintThemeContext);
  const classes = theme === "light"
    ? `${Classes.INPUT}${className ? ` ${className}` : ""}`
    : className;
  return <input className={classes} {...props} />;
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const theme = useContext(BlueprintThemeContext);
  const classes = theme === "light"
    ? `${Classes.INPUT}${className ? ` ${className}` : ""}`
    : className;
  return <textarea className={classes} {...props} />;
}

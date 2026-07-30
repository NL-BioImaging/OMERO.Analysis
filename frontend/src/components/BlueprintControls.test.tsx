import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  BlueprintThemeProvider,
  Button,
  Input,
  TextArea
} from "./BlueprintControls";

describe("Blueprint controls", () => {
  it("uses real Blueprint controls and input classes in the light theme", () => {
    render(
      <BlueprintThemeProvider theme="light">
        <Button>Analyze</Button>
        <Input aria-label="Model" />
        <TextArea aria-label="Prompt" />
      </BlueprintThemeProvider>
    );

    expect(screen.getByRole("button", { name: "Analyze" })).toHaveClass("bp5-button");
    expect(screen.getByLabelText("Model")).toHaveClass("bp5-input");
    expect(screen.getByLabelText("Prompt")).toHaveClass("bp5-input");
  });

  it("leaves the established dark controls unmodified", () => {
    render(
      <BlueprintThemeProvider theme="dark">
        <Button>Analyze</Button>
        <Input aria-label="Model" />
        <TextArea aria-label="Prompt" />
      </BlueprintThemeProvider>
    );

    expect(screen.getByRole("button", { name: "Analyze" })).not.toHaveClass("bp5-button");
    expect(screen.getByLabelText("Model")).not.toHaveClass("bp5-input");
    expect(screen.getByLabelText("Prompt")).not.toHaveClass("bp5-input");
  });
});

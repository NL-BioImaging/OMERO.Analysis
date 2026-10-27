import { fireEvent, render, screen } from "@testing-library/react";
import { useDialogs } from "./Dialogs";

function Harness({finish}: {finish: (values: string[] | null) => void}) {
  const dialogs = useDialogs();
  return <>{dialogs.element}<button onClick={() => void dialogs.chooseMany("Choose image inputs", [
    {value: "Image:1", label: "Intensity"}, {value: "Image:2", label: "Labels"}
  ]).then(finish)}>Open picker</button></>;
}

it("does not preselect unrelated images and permits data-only workspaces", async () => {
  const finish = vi.fn(); render(<Harness finish={finish} />);
  fireEvent.click(screen.getByText("Open picker"));
  expect(screen.getByRole("checkbox", {name: "Intensity"})).not.toBeChecked();
  expect(screen.getByRole("checkbox", {name: "Labels"})).not.toBeChecked();
  fireEvent.click(screen.getByRole("button", {name: "Use selected images"}));
  await Promise.resolve();
  expect(finish).toHaveBeenCalledWith([]);
});

it("returns only explicitly selected image identities", async () => {
  const finish = vi.fn(); render(<Harness finish={finish} />);
  fireEvent.click(screen.getByText("Open picker"));
  fireEvent.click(screen.getByRole("checkbox", {name: "Intensity"}));
  fireEvent.click(screen.getByRole("button", {name: "Use selected images"}));
  await Promise.resolve();
  expect(finish).toHaveBeenCalledWith(["Image:1"]);
});

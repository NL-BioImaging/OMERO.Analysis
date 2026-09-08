import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryResultSaves } from "./QueryResultSaves";
import type { OmeroBridge, QuerySaveReceipt } from "../api";

function fixture() {
  let notify: (receipt: QuerySaveReceipt) => void = () => {};
  const unsubscribe = vi.fn();
  const promote = vi.fn(async () => ({ result: { annotation_id: 42 } }));
  const bridge = {
    subscribeQueryResults: vi.fn((listener) => { notify = listener; return unsubscribe; }),
    promoteRemoteResult: promote
  } as unknown as OmeroBridge;
  const receipt = { annotationId: 11, resultToken: "opaque-token", receipt: "protected-recipe", rowCount: 12, completedAt: Date.now() };
  return { bridge, promote, unsubscribe, emit: () => act(() => notify(receipt)) };
}

it("saves the exact receipt and displays the created attachment", async () => {
  const test = fixture();
  render(<QueryResultSaves bridge={test.bridge} enabled contextKey="a" canAnnotate ttlSeconds={600} />);
  test.emit();
  fireEvent.click(screen.getByText("Save query result to OMERO"));
  await screen.findByText(/Saved CSV and provenance/);
  expect(test.promote).toHaveBeenCalledWith(expect.objectContaining({ receipt: "protected-recipe" }));
  expect(document.body.textContent).not.toContain("protected-recipe");
});

it("hides unsupported features and clears receipts on a workspace change", () => {
  const test = fixture();
  const view = render(<QueryResultSaves bridge={test.bridge} enabled contextKey="a" canAnnotate ttlSeconds={600} />);
  test.emit();
  view.rerender(<QueryResultSaves bridge={test.bridge} enabled contextKey="b" canAnnotate ttlSeconds={600} />);
  expect(screen.queryByText("Save query result to OMERO")).toBeNull();
  view.rerender(<QueryResultSaves bridge={test.bridge} enabled={false} contextKey="b" canAnnotate ttlSeconds={600} />);
  test.emit();
  expect(screen.queryByText("Recent query results")).toBeNull();
});

it("does not save without annotate permission or after expiry", () => {
  const test = fixture();
  render(<QueryResultSaves bridge={test.bridge} enabled contextKey="a" canAnnotate={false} ttlSeconds={0} />);
  test.emit();
  expect(screen.getByText("Save query result to OMERO")).toBeDisabled();
  expect(test.promote).not.toHaveBeenCalled();
});

it("shows a server failure without reexecuting the query", async () => {
  const test = fixture();
  test.promote.mockRejectedValue(new Error("Expired; rerun the query"));
  render(<QueryResultSaves bridge={test.bridge} enabled contextKey="a" canAnnotate ttlSeconds={600} />);
  test.emit();
  fireEvent.click(screen.getByText("Save query result to OMERO"));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Expired"));
  expect(test.promote).toHaveBeenCalledTimes(1);
});

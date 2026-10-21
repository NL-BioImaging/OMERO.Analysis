import {fireEvent, render, screen} from "@testing-library/react";
import {AnalysisHelp, helpSections} from "./AnalysisHelp";
it("provides searchable practical help and keyboard dismissal", () => {
  const close = vi.fn();
  render(<AnalysisHelp onClose={close} />);
  expect(screen.getByRole("navigation", {name: "Help contents"}).querySelectorAll("button").length).toBeGreaterThanOrEqual(20);
  const search = screen.getByRole("searchbox", {name: "Search manual"});
  expect(document.activeElement).toBe(search);
  fireEvent.change(search, {target: {value: "zzznomatchingtopic"}});
  expect(screen.getByText(/No topics match/)).toBeTruthy();
  fireEvent.change(search, {target: {value: "Shift+F10"}});
  expect(screen.getByRole("navigation").querySelectorAll("button").length).toBeGreaterThan(0);
  fireEvent.keyDown(search, {key: "Escape"});
  expect(close).toHaveBeenCalledOnce();
  expect(helpSections("# Title\n\n## First\nText\n## Second\nMore")).toHaveLength(2);
});

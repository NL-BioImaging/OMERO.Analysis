import {
  activityText,
  executionActivityText,
  formatDuration,
  projectRowClassName
} from "./presentation";

describe("chat timing presentation", () => {
  it("formats short and long elapsed times", () => {
    expect(formatDuration(850)).toBe("0.8 sec");
    expect(formatDuration(12_400)).toBe("12 sec");
    expect(formatDuration(75_000)).toBe("1 min 15 sec");
    expect(activityText("thought", 2_400)).toBe("Thought for 2.4 sec");
    expect(activityText("worked", 12_400)).toBe("Worked for 12 sec");
  });

  it("identifies internal inspection timing", () => {
    expect(executionActivityText("inspection", 1_250)).toBe(
      "Worked for 1.3 sec · for AI data inspection"
    );
  });
});

describe("browser-local project selection", () => {
  it("selects the clicked project independently from the open project", () => {
    expect(projectRowClassName("imported", "imported", "older")).toBe(
      "browser-row project-row open"
    );
    expect(projectRowClassName("older", "imported", "older")).toBe(
      "browser-row project-row selected"
    );
  });
});

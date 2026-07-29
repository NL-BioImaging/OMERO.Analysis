import { describe, expect, it } from "vitest";
import { customSkillFromText, customSkillMatches, githubRawUrl } from "./customSkills";
import type { WorkspaceFile } from "./types";

describe("simple user skills", () => {
  it("reads the simple Markdown metadata format and matches input extensions", async () => {
    const skill = await customSkillFromText({
      filename: "plate.skill.md",
      sourceType: "upload",
      content: "---\nname: plate-layout\ndescription: Explains plate tables\nextensions: csv, xlsx\n---\n# Guidance"
    });
    expect(skill.name).toBe("plate-layout");
    expect(skill.extensions).toEqual(["csv", "xlsx"]);
    expect(customSkillMatches(skill, [{
      id: "file",
      workspaceId: "workspace",
      name: "layout.csv",
      logicalPath: "/input/layout.csv",
      type: "text/csv",
      size: 1,
      sha256: "hash",
      source: "local",
      state: "ready",
      createdAt: "2026-01-01"
    } as WorkspaceFile])).toBe(true);
  });

  it("converts GitHub blob links into direct Markdown links", () => {
    expect(githubRawUrl(
      "https://github.com/example/repo/blob/main/SKILL.md"
    )).toBe(
      "https://raw.githubusercontent.com/example/repo/main/SKILL.md"
    );
  });
});

import { parseDelimited } from "./WorkspacePanels";

describe("artifact delimited previews", () => {
  it("renders bounded CSV rows and preserves quoted delimiters", () => {
    expect(parseDelimited('well,label,value\nA1,"cells, total",12\n', ",")).toEqual([
      ["well", "label", "value"],
      ["A1", "cells, total", "12"]
    ]);
  });

  it("limits previews to one header and one hundred data rows", () => {
    const source = ["value", ...Array.from({ length: 150 }, (_, index) => String(index))].join("\n");
    expect(parseDelimited(source, ",")).toHaveLength(101);
  });
});

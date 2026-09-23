import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

it("only marks allowlisted ID/name pairs and preserves quicksearch visibility", () => {
  document.body.innerHTML = `<script id="analysis-retired-records" type="application/json">${JSON.stringify({ kind: "users", records: { "102": "dqw-test-abc-owner" } })}</script>
    <table id="experimenterTable"><tbody>
    <tr><td>102</td><td>Retired</td><td>dqw-test-abc-owner</td></tr>
    <tr><td>103</td><td>Inactive real user</td><td>alice</td></tr>
    <tr><td>104</td><td>Another fixture</td><td>dqw-test-other-owner</td></tr>
    </tbody></table>`;
  const source = readFileSync(resolve(process.cwd(), "../src/omero_analysis/static/omero_analysis_admin/retired-test-records.js"), "utf8");
  window.eval(source);
  const marked = document.querySelectorAll(".analysis-retired-fixture");
  expect(marked).toHaveLength(1);
  (marked[0] as HTMLElement).style.display = "none"; // existing quicksearch
  (document.querySelector("input[type=checkbox]") as HTMLInputElement).click();
  expect(document.querySelector("table")?.classList.contains("analysis-show-retired")).toBe(true);
  expect((marked[0] as HTMLElement).style.display).toBe("none");
});

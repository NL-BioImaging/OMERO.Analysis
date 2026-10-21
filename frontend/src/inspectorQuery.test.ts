import { browseQuery, pageQuery, resultCsv } from "./inspectorQuery";
it("bounds queries and safely quotes identifiers and filter values", () => {
  const query = browseQuery('table"odd', ["name"], "name", "a%' OR 1=1 --");
  expect(query.sql).toContain('"table""odd"');
  expect(query.sql).not.toContain("OR 1=1");
  expect(query.parameters["filter"].value).toContain("\\%");
  expect(pageQuery(query.sql, 2)).toContain("LIMIT 100 OFFSET 200");
});
it.each(["DELETE FROM t", "SELECT 1; DROP TABLE t", "SELECT * FROM read_csv('/secrets')", "PRAGMA x"])("rejects unsafe query %s", query => {
  expect(() => pageQuery(query, 0)).toThrow("read-only");
});
it("escapes CSV cells and spreadsheet formulas", () => {
  expect(resultCsv(["a"], [['=HYPERLINK("x")'], [null]])).toContain(`"'=HYPERLINK(""x"")"`);
});

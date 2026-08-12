import { upgradeLegacyDatabaseCode } from "./legacyRemoteQuery";

describe("legacy database Method remote upgrade", () => {
  it("moves a single DuckDB query to a broker-managed CSV binding", () => {
    const code = `import duckdb
import pandas as pd
DB_PATH = "/input/old.duckdb"
con = duckdb.connect(DB_PATH, read_only=True)
sql = r"""SELECT plate_row, count(*) AS cells FROM object_features GROUP BY 1"""
df = con.sql(sql).df()
con.close()`;
    const upgraded = upgradeLegacyDatabaseCode(code, "method-v1", ["object_features"], "plate.duckdb");
    expect(upgraded?.recipes).toHaveLength(1);
    expect(upgraded?.recipes[0].sql).toContain("object_features");
    expect(upgraded?.code).toContain('pd.read_csv(remote_query_csv("method-v1-1"))');
    expect(upgraded?.code).toContain('"remote://plate.duckdb"');
    expect(upgraded?.code).not.toContain("duckdb.connect");
  });

  it("upgrades multiple schema and conditional queries using the remote schema", () => {
    const code = `import duckdb
import pandas as pd
DB_PATH = "/input/old.duckdb"
con = duckdb.connect(DB_PATH, read_only=True)
schema_info = con.sql("SELECT key, value FROM schema_info").df()
rels = con.sql("""SELECT table_name FROM information_schema.tables""").df()
if use_foci_view:
    query = """SELECT * FROM foci_assignments"""
else:
    query = """SELECT * FROM relationships"""
agg = con.sql(query).df()
con.close()`;
    const upgraded = upgradeLegacyDatabaseCode(
      code, "pipeline-step", ["schema_info", "foci_assignments"], "large.duckdb"
    );
    expect(upgraded?.recipes).toHaveLength(3);
    expect(upgraded?.recipes[2].sql).toContain("foci_assignments");
    expect(upgraded?.code.match(/remote_query_csv/g)).toHaveLength(4);
  });

  it("fails closed when legacy code uses unsupported connection operations", () => {
    const code = `import duckdb
con = duckdb.connect("/input/old.duckdb", read_only=True)
con.execute("CREATE TABLE unsafe AS SELECT 1")`;
    expect(upgradeLegacyDatabaseCode(code, "unsafe", [], "large.duckdb")).toBeNull();
  });
});

import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadPyodide } from "pyodide";

const runtime = resolve(
  import.meta.dirname,
  "../../src/omero_analysis_chat/static/omero_analysis_chat/pyodide"
);
const manifest = JSON.parse(await readFile(resolve(runtime, "RUNTIME.json"), "utf8"));
const pyodide = await loadPyodide({ indexURL: `${runtime}/` });
await pyodide.loadPackage([
  "numpy",
  "pandas",
  "matplotlib",
  "scipy",
  "duckdb",
  "pyarrow",
  "python-calamine",
  "xlrd"
]);
try {
  pyodide.unpackArchive(
    Uint8Array.from(
      await readFile(resolve(runtime, "seaborn-0.13.2-py3-none-any.whl"))
    ),
    "zip",
    { extractDir: pyodide.sitePackages }
  );
} catch (error) {
  throw new Error(`Could not install vendored seaborn wheel: ${error?.message || error}`);
}
const result = await pyodide.runPythonAsync(`
import json, sqlite3, zipfile
from pathlib import Path
import duckdb
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy
import seaborn as sns

root = Path("/tmp/oac-smoke")
root.mkdir(parents=True, exist_ok=True)
frame = pd.DataFrame({"group": ["a", "a", "b"], "value": [1.0, 2.0, 4.0]})
frame.to_csv(root / "data.csv", index=False)
(root / "data.json").write_text(frame.to_json(orient="records"))
frame.to_parquet(root / "data.parquet", index=False)
np.save(root / "data.npy", frame["value"].to_numpy())
np.savez(root / "data.npz", values=frame["value"].to_numpy())
with zipfile.ZipFile(root / "data.xlsx", "w") as archive:
    archive.writestr("[Content_Types].xml", """<?xml version="1.0"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
      <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
    </Types>""")
    archive.writestr("_rels/.rels", """<?xml version="1.0"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
    </Relationships>""")
    archive.writestr("xl/workbook.xml", """<?xml version="1.0"?>
    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
      xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
      <sheets><sheet name="Data" sheetId="1" r:id="rId1"/></sheets>
    </workbook>""")
    archive.writestr("xl/_rels/workbook.xml.rels", """<?xml version="1.0"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
    </Relationships>""")
    archive.writestr("xl/worksheets/sheet1.xml", """<?xml version="1.0"?>
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>
      <row r="1"><c r="A1" t="inlineStr"><is><t>value</t></is></c></row>
      <row r="2"><c r="A2"><v>7</v></c></row>
    </sheetData></worksheet>""")

with sqlite3.connect(root / "data.sqlite") as db:
    frame.to_sql("measurements", db, index=False)
with duckdb.connect(str(root / "data.duckdb")) as db:
    db.execute("CREATE TABLE measurements AS SELECT * FROM frame")

assert len(pd.read_csv(root / "data.csv")) == 3
assert len(pd.read_json(root / "data.json")) == 3
assert len(pd.read_parquet(root / "data.parquet")) == 3
assert np.load(root / "data.npy").sum() == 7
assert np.load(root / "data.npz")["values"].sum() == 7
assert pd.read_excel(root / "data.xlsx", engine="calamine")["value"].iloc[0] == 7
with sqlite3.connect(root / "data.sqlite") as db:
    assert db.execute("SELECT COUNT(*) FROM measurements").fetchone()[0] == 3
with duckdb.connect(str(root / "data.duckdb"), read_only=True) as db:
    assert db.execute("SELECT COUNT(*) FROM measurements").fetchone()[0] == 3

plt.plot(frame["value"])
plt.savefig(root / "plot.png")
assert (root / "plot.png").stat().st_size > 100
sns.set_theme()
assert scipy.__version__
json.dumps({"rows": len(frame), "sum": float(frame["value"].sum())})
`);
const parsed = JSON.parse(result);
if (parsed.rows !== 3 || parsed.sum !== 7) throw new Error(`Unexpected result: ${result}`);
console.log(
  `Runtime smoke passed on Pyodide ${manifest.pyodide}: CSV, JSON, SQLite, ` +
  "DuckDB, Excel, Parquet, NPY, NPZ, pandas, Matplotlib, SciPy, and seaborn"
);

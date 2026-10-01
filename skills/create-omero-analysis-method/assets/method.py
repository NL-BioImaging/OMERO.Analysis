from pathlib import Path
import pandas as pd

OA_METHOD_PARAMETERS_JSON = r'''[
  {"name":"minimum", "label":"Minimum value", "type":"number", "defaultValue":0, "required":true}
]'''

parameters = globals().get("OA_PARAMETERS", {"minimum": 0})
source = Path("/input/data.csv")
if not source.is_file():
    source = Path("input/data.csv")
destination = Path("/output") if Path("/input").is_dir() else Path("results")
destination.mkdir(parents=True, exist_ok=True)

# This fixture declares sample_id as text. Adapt the mapping after inspecting real headers.
data = pd.read_csv(source, dtype={"sample_id": "string"})
selected = data.loc[data["value"].ge(parameters["minimum"])]
selected.to_csv(destination / "selected.csv", index=False)
result = {"selected_rows": len(selected), "minimum": parameters["minimum"]}

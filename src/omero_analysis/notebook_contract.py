"""Inspect portable notebook declarations without importing or executing code."""
import ast
import copy
import json
import math
import re

from .errors import UnsupportedMedia

SCHEMA = "nl.bioimaging.omero-analysis-notebook.v1"


def prepare_notebook(document):
    clean = copy.deepcopy(document)
    clean.setdefault("metadata", {}).pop("widgets", None)
    marked = []
    for cell in clean["cells"]:
        if cell["cell_type"] == "code":
            cell["outputs"] = []
            cell["execution_count"] = None
            if "omero-analysis-config" in cell.get("metadata", {}).get("tags", []):
                marked.append(cell)
    if not marked:
        return clean, None
    try:
        if len(marked) != 1 or marked[0] is not clean["cells"][0]:
            raise ValueError("The configuration must be the first cell and uniquely tagged")
        source = marked[0]["source"]
        tree = ast.parse("".join(source) if isinstance(source, list) else source)
        calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call)
                 and ((isinstance(node.func, ast.Attribute) and node.func.attr == "configure"
                       and isinstance(node.func.value, ast.Name) and node.func.value.id == "oan")
                      or (isinstance(node.func, ast.Name) and node.func.id == "configure"))]
        if len(calls) != 1 or not calls[0].args:
            raise ValueError("Configuration must contain one configure(literal_json) call")
        contract = json.loads(ast.literal_eval(calls[0].args[0]))
        if contract.get("schema") != SCHEMA or not isinstance(contract.get("inputs"), list) or not contract["inputs"]:
            raise ValueError("Unsupported notebook contract or missing inputs")
        ids = set()
        for item in contract["inputs"]:
            identifier = item.get("id", "")
            if not re.fullmatch(r"[a-z][a-z0-9_-]{0,63}", identifier) or identifier in ids:
                raise ValueError("Invalid or duplicate notebook input id")
            ids.add(identifier)
            parts = item["path"].replace("\\", "/").split("/")
            if parts[0] != "input" or ".." in parts:
                raise ValueError("Notebook input paths must remain within input/")
            item.setdefault("required", True)
            if not isinstance(item["required"], bool):
                raise ValueError("Input required must be boolean")
            if item["kind"] == "query":
                formats = item["formats"]
                if not isinstance(formats, list) or not formats or any(
                    f not in {"duckdb", "sqlite", "sqlite3", "csv"} for f in formats
                ):
                    raise ValueError("Unsupported notebook query format")
            elif item["kind"] == "file":
                extensions = item["extensions"]
                if not isinstance(extensions, list) or not extensions or any(
                    not isinstance(e, str) or not re.fullmatch(r"\.[A-Za-z0-9][A-Za-z0-9._-]*", e)
                    for e in extensions
                ):
                    raise ValueError("Invalid supporting file extensions")
                item["extensions"] = [e.lower() for e in extensions]
            else:
                raise ValueError("Unsupported input kind")
            requirements = clean.get("metadata", {}).get("omero_analysis", {}).get("schema_requirements", {})
            if item["kind"] == "query" and requirements.get(identifier, {}).get("tables"):
                item["schema"] = {"tables": requirements[identifier]["tables"]}
            tables = item.get("schema", {}).get("tables", [])
            if not isinstance(tables, list) or any(
                not isinstance(t, dict) or not isinstance(t.get("name"), str)
                or not isinstance(t.get("columns", []), list)
                or any(not isinstance(c, dict) or not isinstance(c.get("name"), str)
                       or (c.get("type") is not None and not isinstance(c["type"], str))
                       for c in t.get("columns", [])) for t in tables
            ):
                raise ValueError("Invalid table/column requirements")
        parts = contract["results"]["path"].replace("\\", "/").split("/")
        if parts[0] != "results" or ".." in parts:
            raise ValueError("Notebook results must remain within results/")
        requirements = contract.setdefault("requirements", [])
        if not isinstance(requirements, list) or any(not isinstance(r, str) or not re.fullmatch(
                r"[A-Za-z0-9][A-Za-z0-9._<>=!~,-]*", r) for r in requirements):
            raise ValueError("Invalid package requirements")
        contract.setdefault("parameters", [])
        if not isinstance(contract["parameters"], list):
            raise ValueError("Invalid notebook parameters")
        names = set()
        for parameter in contract["parameters"]:
            _validate_parameter(parameter, ids, names)
        return clean, contract
    except (ValueError, TypeError, KeyError, AttributeError, SyntaxError, RecursionError) as exc:
        raise UnsupportedMedia(f"Invalid portable notebook: {exc}") from exc


def _validate_parameter(value, input_ids, names):
    name, kind = value.get("name", ""), value.get("type")
    if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]{0,63}", name) or name in names:
        raise ValueError("Invalid or duplicate parameter name")
    names.add(name)
    if kind not in {"boolean", "integer", "number", "string", "choice"}:
        raise ValueError(f"Invalid parameter type for {name}")
    numeric = lambda v: type(v) in {int, float} and math.isfinite(v)
    valid = {"boolean": lambda v: isinstance(v, bool), "integer": lambda v: type(v) is int and abs(v) <= 9007199254740991,
             "number": numeric, "string": lambda v: isinstance(v, str),
             "choice": lambda v: type(v) in {str, bool, int, float}}
    if value.get("default") is not None and not valid[kind](value["default"]):
        raise ValueError(f"Invalid default for {name}")
    for field in ("label", "help"):
        if value.get(field) is not None and not isinstance(value[field], str):
            raise ValueError(f"Invalid {field} for {name}")
    if kind in {"integer", "number"}:
        if any(value.get(k) is not None and not numeric(value[k]) for k in ("minimum", "maximum", "step")):
            raise ValueError(f"Invalid numeric bounds for {name}")
        if value.get("minimum") is not None and value.get("maximum") is not None and value["minimum"] > value["maximum"]:
            raise ValueError(f"Invalid numeric range for {name}")
        if value.get("step") is not None and value["step"] <= 0:
            raise ValueError(f"Invalid step for {name}")
    if kind == "choice":
        choices, query = value.get("choices"), value.get("choices_query")
        if choices is None and query is None:
            raise ValueError(f"Missing choices for {name}")
        if choices is not None and (not isinstance(choices, list) or not choices or any(not valid[kind](c) for c in choices)):
            raise ValueError(f"Invalid choices for {name}")
        if query is not None:
            if query.get("source") not in input_ids:
                raise ValueError(f"Unknown choices input for {name}")
            query.setdefault("limit", 100)
            if type(query["limit"]) is not int or not 1 <= query["limit"] <= 1000:
                raise ValueError(f"Invalid choices limit for {name}")
            for field in ("value_column", "label_column"):
                if query.get(field) is not None and not isinstance(query[field], str):
                    raise ValueError(f"Invalid choices {field}")
            sql = re.sub(r"--[^\n]*|/\*.*?\*/", " ", query["sql"], flags=re.S).strip()
            if (not re.match(r"^(select|with)\b", sql, re.I) or ";" in sql.rstrip(";")
                    or re.search(r"\b(attach|copy|pragma|install|load|create|alter|drop|insert|update|delete|merge|call|set|reset)\b", sql, re.I)
                    or re.search(r"\b(read_csv|read_csv_auto|read_parquet|read_json|sqlite_scan|postgres_scan|httpfs|delta_scan|iceberg_scan|shell|system)\s*\(", sql, re.I)):
                raise ValueError(f"Unsafe choices query for {name}")

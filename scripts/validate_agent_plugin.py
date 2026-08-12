"""Validate the repository Agent Plugin without fetching schemas."""

from __future__ import annotations

import json
import re
from pathlib import Path

import jsonschema


ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    manifest = json.loads((ROOT / "plugin.json").read_text(encoding="utf-8"))
    schema = json.loads(
        (ROOT / "schemas/agent-plugins/plugin.schema.json").read_text(encoding="utf-8")
    )
    jsonschema.Draft202012Validator(schema).validate(manifest)
    skills = ROOT / "skills"
    found = []
    for directory in sorted(path for path in skills.iterdir() if path.is_dir()):
        skill = directory / "SKILL.md"
        if not skill.is_file():
            raise ValueError(f"Immediate skill directory has no SKILL.md: {directory}")
        text = skill.read_text(encoding="utf-8")
        header = re.match(r"^---\n(.*?)\n---\n", text, re.S)
        if not header:
            raise ValueError(f"Skill frontmatter is missing: {skill}")
        name = re.search(r"^name:\s*([^\n]+)$", header.group(1), re.M)
        description = re.search(r"^description:\s*([^\n]+)$", header.group(1), re.M)
        if not name or name.group(1).strip() != directory.name:
            raise ValueError(f"Skill name must match its directory: {skill}")
        if not description or not description.group(1).strip():
            raise ValueError(f"Skill description is missing: {skill}")
        found.append(directory.name)
    if not found:
        raise ValueError("Plugin has no skills")
    print(f"Validated Agent Plugin {manifest['name']} {manifest.get('version')} with {len(found)} skill(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

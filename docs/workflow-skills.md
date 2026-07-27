# Dynamic BIOMERO workflow skills

OMERO.AnalysisChat uses `omero-workflow-skills>=0.2,<0.3` as a shared,
framework-neutral catalog. It reads the existing BIOMERO workflow
configuration, resolves each configured GitHub tag, branch, or commit, and
accepts only validated UTF-8 Agent Skill instructions and text references. It
does not modify or depend on `OMERO.biomero`.

Authenticated routes expose a consumer-filtered catalog and package:

```text
GET  /omero_analysis_chat/api/workflow-skills/
GET  /omero_analysis_chat/api/workflow-skills/<workflow>/<skill>/
POST /omero_analysis_chat/api/workflow-skills/refresh/
```

Refresh is OMERO-admin-only. Set `BIOMERO_GITHUB_TOKEN` on OMERO.web for
private repositories; it is never returned to the browser.

Before every question, AnalysisChat matches skills using file extensions,
filename globs, and locally derived schema profiles. It automatically loads the
strongest match's `SKILL.md`. The model can call `discover_skills` and
`load_skill` to inspect alternatives and progressively load listed references.
The user does not need to request a skill.

Skill source URL, configured ref, resolved commit, version, and hash are stored
with chat turns and executions and participate in execution-cache keys.
Specialized workflow knowledge has been removed from the global system prompt;
privacy, browser paths, execution limits, and tools remain plugin-owned. If the
catalog is unavailable, generic schema-first analysis continues with a visible
warning.

Catalog 0.2 also discovers application-operation skills from the optional
`[APPLICATIONS]` configuration. These skills are never auto-activated merely
because a database is present. AnalysisChat exposes them to the model when an
application is installed and loads them for an explicit operation request,
such as showing a measured object in ZarrViewer. This keeps workflow analysis
knowledge separate from application-specific routes and UI behavior.

Example application configuration:

```ini
[APPLICATIONS]
omero-zarr-viewer_repo = https://github.com/NL-BioImaging/BIOMERO.ZarrViewer/tree/v0.3.0
omero-zarr-viewer_skills_path = _agents/skills
```

Workflow authors should follow the contract documented by
[OMERO.WorkflowSkills](https://github.com/NL-BioImaging/OMERO.WorkflowSkills).
Publish portable skills in a tagged workflow release before changing the
BIOMERO repository pin. Tags/commits are immutable in cache, branches are
revalidated hourly, and only transient failures of the same source may use
stale data.

The Docker installer uses an offline wheelhouse containing the plugin and its
tested companion wheel. Removing AnalysisChat keeps the library if
OMERO.JupyterLite or another installed consumer still requires it.

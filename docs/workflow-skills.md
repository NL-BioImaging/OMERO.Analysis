# Optional BIOMERO measurement skills

OMERO.Analysis can use `biomero-workflow-skills>=0.3,<0.4` as an optional,
framework-neutral catalog. It reads the existing BIOMERO pipeline
configuration, resolves each configured GitHub tag, branch, or commit, and
accepts only validated UTF-8 attachment-analysis skill instructions and text
references. Analysis starts with generic Chat when the provider is absent.

Authenticated routes expose a consumer-filtered catalog and package:

```text
GET  /omero_analysis/api/workflow-skills/
GET  /omero_analysis/api/workflow-skills/<workflow>/<skill>/
POST /omero_analysis/api/workflow-skills/refresh/
```

Refresh is OMERO-admin-only. Set `BIOMERO_GITHUB_TOKEN` on OMERO.web for
private repositories; it is never returned to the browser.

Before every question, Analysis matches skills using file extensions,
filename globs, and locally derived schema profiles. It automatically loads the
strongest match's `SKILL.md`, every `biomero-required-resources` reference, and
the declared `biomero-required-capabilities` contract. Optional references
remain progressively loadable. Exact input paths and the current evidence
ledger are injected before the first response, so routine file and schema
discovery is not repeated. The user does not need to request a skill.

Skill source URL, configured ref, resolved commit, version, and hash are stored
with chat turns and executions and participate in execution-cache keys.
Specialized measurement knowledge is absent from the global system prompt;
privacy, browser paths, execution limits, and tools remain plugin-owned. If the
catalog is unavailable, generic schema-first analysis continues with a visible
warning.

`[APPLICATIONS]` is not a discovery source. Applications publish their own
authenticated provider endpoints. BIOMERO.ZarrViewer therefore serves
`use-omero-zarr-viewer` itself, and Analysis loads that package only for an
explicit ZarrViewer operation.

Skill authors should follow the contract documented by
[BIOMERO.WorkflowSkills](https://github.com/NL-BioImaging/BIOMERO.WorkflowSkills).
Publish portable measurement skills in a tagged release before changing the
BIOMERO repository pin. Tags and commits are immutable in cache, branches are
revalidated hourly, and only transient failures of the same source may use
stale data.

The Docker installer uses an offline wheelhouse containing the plugin and its
tested optional companion wheel. Notebook execution never requests this
catalog or injects skill instructions.

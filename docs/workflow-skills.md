# Workflow guidance and notebook examples

The **Skills** tab offers notebook-authoring guidance, workflow measurement
skills, and skills from installed viewer providers. It supports previews,
individual downloads, a portable bundle, and a copyable external-chat prompt.
Analysis makes no AI-provider requests and stores no AI credentials. Custom skill
uploads, linked skills, and the former `~AnalysisSettings` synchronization are retired.

To use an external chat, preview the guidance and optional workspace schema context,
download the bundle, copy the prompt, and attach the downloaded files to the chat.
Request a portable `.ipynb`, then import it in **Notebooks**. The optional context
contains input names/formats, table and column names/types, and relevant
capabilities. It excludes measurements, notebook outputs, credentials, and tokens.

`biomero-workflow-skills>=0.4,<0.5` is an optional framework-neutral catalog. It reads
the configured BIOMERO workflow repositories at their configured revisions and
exposes validated UTF-8 attachment-analysis guidance and text references. Without
it, the built-in notebook guidance remains available.

Authenticated routes expose the consumer-filtered catalog and skill packages:

```text
GET  /omero_analysis/api/workflow-skills/
GET  /omero_analysis/api/workflow-skills/<workflow>/<skill>/
POST /omero_analysis/api/workflow-skills/refresh/
```

Refresh is OMERO-admin-only. Private-repository access may use the server's
`BIOMERO_GITHUB_TOKEN`; it is never included in downloaded guidance or browser responses.
Source URL, configured ref, resolved immutable commit, version, and SHA256 identify
each package. Tags/commits are immutable in cache; branches are revalidated hourly.
Only transient failures for the same source can use cached data, with a visible warning.

Workflow repositories may declare optional notebook assets in
`extensions.nl.bioimaging.biomero.notebooks` in `plugin.json`. Each declaration
provides a title, repository-relative `.ipynb` path, SHA256, and compatibility
metadata matching its portable notebook input contract. Assets are validated without
execution; imports retain immutable commit/checksum provenance and copy the notebook
into the workspace. **Libraries → Workflow examples** shows available examples and
their compatibility with selected inputs.

CI-specific examples belong to the cisegmentation repository alongside its
measurement-analysis skill. Unreleased examples can be imported explicitly from a
local `.ipynb`; exposing examples must not change the segmentation execution pin.
Analysis retains generic CSV/database starters and contains no CI-specific inference.

Applications publish their own authenticated guidance providers. Installed
BIOMERO.ZarrViewer supplies `use-omero-zarr-viewer`; arbitrary file paths cannot
create viewer links. Notebook execution never injects downloaded skill instructions.

The standard Analysis installation keeps the catalog optional. The local image
builder accepts `-WithWorkflowSkills` to include the sibling catalog package.
Installing or removing Analysis does not implicitly install or remove that provider.

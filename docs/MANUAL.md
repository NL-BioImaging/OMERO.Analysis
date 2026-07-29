# OMERO.Analysis Manual

OMERO.Analysis combines browser-local data analysis, reusable Methods and
Pipelines, run-only Notebooks, and explicit synchronization with OMERO.
Notebook code and generated Python run locally in the browser. Source data are
not sent to the configured AI provider.

## Getting started

1. Select an Image, Dataset, Plate, or Screen in OMERO.web.
2. Choose **Analysis Chat** or **Analysis Notebook** in the center-panel menu.
3. Select the data attachments needed for the analysis.
4. Open Analysis. Inputs appear in the Workspace **Input** folder.

Use **Analysis Chat** for questions and AI-assisted analysis. Use
**Analysis Notebook** to open or run an existing Python nbformat-4 notebook.

## Workspace structure

- **Input** contains OMERO attachments and browser-local files used by analyses.
- **Chat** contains each conversation and its Chat results.
- **Methods** contains reusable Python analyses and Method results.
- **Pipelines** contains ordered Method executions and Pipeline results.
- **Notebooks** contains attached, uploaded, or converted notebooks and Notebook
  results.

The Artifact Inspector can inspect every selectable Workspace item. The left
and right panes are resizable.

## Chat analysis

Choose a Chat, enter a question, and wait until the status returns to **Ready**.
The assistant can inspect supported data locally, generate Python, run it in
the isolated browser runtime, and summarize the result.

Saving is available only after the assistant has finished the turn. A saved
Method contains the final assistant summary as Python comments above the
reproducible code.

## Methods and Pipelines

A Method is reusable Python with version history and an inferred input
contract. Select Methods and use **Combine** to create a Pipeline. Methods or
Pipelines that do not depend on ZarrViewer can be converted to a Notebook.

Running a Method or Pipeline switches to Chat. Results are placed in the
corresponding results folder.

## Notebooks

Notebooks are read-only Python nbformat-4 documents. They never run
automatically. Use **Open** to inspect a Notebook and **Run** to reset the
kernel, attach current inputs, and execute all cells in order.

Notebook execution does not load AI providers, Chat skills, JupyterLab,
widgets, shell commands, or network package downloads.

## Workspace synchronization

**Synchronize with OMERO** mirrors non-deleted Workspace content into the
marked `+AnalysisWorkspaces` Project for the current user and group. PNG
results become OMERO Images. Other results, Chats, Methods, Pipelines, and
Notebooks become typed attachments.

Ready input files with `template` anywhere in the filename are also
synchronized under `Templates`. Other source inputs are excluded.

Synchronization is manual and one-way. The browser Workspace is the source of
truth for each explicit synchronization.

## Reusing AnalysisWorkspaces

Use **Import from AnalysisWorkspaces** to browse synchronized Datasets and copy
Methods, Pipelines, or Notebooks into the current browser Workspace. Imports
are independent copies and do not modify the library original.

The Analysis Notebook OMERO panel shows only reusable Notebooks. The Analysis
Chat panel can show Methods, Pipelines, and Notebooks.

## Analysis Settings

**Plot + CSV** asks Chat to save both a visual plot and the corresponding
tabular data. This preference is included when settings are synchronized.

## AI profiles

An AI profile contains:

- A profile name
- OpenAI-compatible Chat Completions or Anthropic Messages protocol
- Provider endpoint
- Authentication-header type
- Model or deployment name
- API key
- Optional context-window size

Use **Validate connection** after editing a profile. The validation request is
small but may be billed by the provider.

Use **Sync Settings** to store all profiles in the marked
`+AnalysisSettings` Project and its **AI Settings** Dataset. The settings JSON
is placed in a ZIP archive and encrypted server-side before it is attached to
OMERO. Encryption is scoped to the current OMERO user and group.

## Skills

A skill is Markdown guidance that helps Chat understand a data format or
domain. It does not execute code and is never loaded by Notebook.

Automatically discovered BIOMERO and ZarrViewer skills are shown as collapsed
cards. Their source links open the provider repository or skill URL.

You can upload a Markdown skill or link a direct HTTPS Markdown URL. User
skills can be enabled or disabled. Enabled skills match all inputs unless
their metadata lists file extensions.

## Simple skill format

A simple skill can be one Markdown file:

```markdown
---
name: my-table-guide
description: Explains the exported measurement tables
extensions: csv, xlsx
---

# Tables

`objects.csv` contains one row per segmented object.
`images.csv` contains image metadata.

# Relationships

Join `objects.image_id` to `images.id`.

# Analysis guidance

Use `well` as the experimental unit and do not treat individual objects as
independent replicates.
```

Useful skill content includes table meanings, primary keys, relationships,
units, missing-value conventions, experimental units, and analysis caveats.
Do not put API keys or other secrets in skill files.

Uploaded skills are copied into the **Skills** Dataset in
`+AnalysisSettings` when **Sync Settings** is used.

## Settings synchronization

The **Sync Settings** button synchronizes:

- Analysis Settings
- Every AI profile
- User-added skills

Settings are scoped to the current OMERO user and group. Opening Analysis in
the same group restores the latest synchronized settings when available.

## Privacy and security

- Data analysis and Notebook execution run in the browser.
- AI requests contain prompts, generated code, bounded previews and summaries,
  and errors—not source files.
- API keys synchronized to OMERO are encrypted at rest.
- Custom skills are instructions and can influence Chat behavior. Add skills
  only from sources you trust.
- Notebook HTML and JavaScript output are not executed.

## Troubleshooting

If Chat is unavailable, check that the runtime is Ready and that the active AI
profile has an endpoint, model, and key. Use **Validate connection** for
specific endpoint, authentication, model, CORS, or response-format errors.

If synchronization fails, confirm that the selected OMERO group permits
Project/Dataset creation and FileAnnotation creation, then retry after the
session keepalive has renewed the connection.

If a custom URL skill cannot be loaded, use a direct HTTPS Markdown URL or
upload the file. GitHub `blob` URLs are converted to their raw-content form.

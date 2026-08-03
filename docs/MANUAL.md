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
- **Chat** contains each conversation, its `Attachments` folder, and its Chat results.
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

Use **Attach files** or **File URL** beside the composer to add up to ten
Chat-wide attachments of at most 25 MiB each. Supported formats are UTF-8 TXT,
searchable PDF, DOCX, PNG, JPEG, and WebP. Direct URLs must be public HTTPS
file URLs that the browser can fetch without credentials; webpages are not
supported. PDF and DOCX extraction runs in browser Python, and OCR is not
performed. A missing, unreadable, oversized, or image-only document blocks
sending until it is reselected or removed.

Attachment text must fit the displayed model-context budget and is never
silently truncated. Images require a vision-capable model; Analysis uses local
server metadata when available and performs one harmless cached image probe
when support is unknown. Changing to a non-vision model keeps the originals
but blocks sending while image attachments remain active.

Every user message is followed by a collapsed **AI activity** card before the
**Analysis (local)** result. Expand it to see the live response, concise
progress and validation steps, tool purposes, and the completed user-facing AI
transcript for that turn. Private model chain-of-thought is neither displayed
nor stored.

When the assistant cannot continue without a real choice, the activity card
opens automatically and presents two to four answer buttons. Selecting an
answer resumes the same AI turn. **Stop** cancels a waiting question as well as
the running analysis. A question restored after reloading the page is shown as
inactive; answer it as a new Chat message.

Each assistant response has two small controls:

- The **copy icon** immediately before the star copies the complete assistant
  response, including its Markdown, to the clipboard.
- The **star** pins or unpins the message. An empty star means the message is
  not pinned; a filled star means it is pinned. Pinned messages are retained
  in the context sent to the AI even when an older, long conversation is
  compacted. Use this for important decisions, definitions, caveats, or
  results that later questions still need. Pinning does not save a Method,
  attach anything to OMERO, or prevent the Chat itself from being deleted.

Recent messages are included automatically, so it is not necessary to pin
every response. Pin only information that should remain available throughout
a long Chat. Click the filled star again to unpin it.

Saving is available only after the assistant has finished the turn. A saved
Method contains the final assistant summary as Python comments above the
reproducible code.

When an answer is supported by generated files, **Supporting results** buttons
name the actual image or data file they open in the Artifact Inspector.
Repeated executions that produced identical bytes are shown only once; an
image and its corresponding CSV remain separate because they are different
forms of evidence.

## Methods and Pipelines

A Method is reusable Python with version history and an inferred input
contract. Select at least two Methods and use **To Pipeline** to create an
ordered Pipeline. Use **To Notebook** to convert selected Methods or Pipelines
that do not depend on ZarrViewer.

The Method menu provides **Run**, **Rename**, **Download**, and **Delete
method**. The Pipeline menu provides the corresponding **Run**, **Rename**,
**Download**, and **Delete pipeline** actions.

Running a Method or Pipeline switches to Chat. Results are placed in the
corresponding results folder.

## Notebooks

Notebooks are read-only Python nbformat-4 documents. They never run
automatically. Use **Open** to inspect a Notebook and **Run** to reset the
kernel, attach current inputs, and execute all cells in order.

The Notebook menu provides **Open**, **Run**, **Rename**, **Download**, and
**Delete notebook**. Deleting the browser copy does not delete an existing
OMERO FileAnnotation.

Use **Reattach input data** after the Workspace inputs change. Analysis
synchronizes the ready local inputs under `/input`, adds or updates one visible
first code cell named **OMERO.Analysis input bindings**, and updates
unambiguous `/input/...` filenames in the remaining code cells. Reattaching
the same inputs updates that binding cell instead of creating duplicates.

Notebook execution does not load AI providers, Chat skills, JupyterLab,
widgets, shell commands, or network package downloads.

## Workspace synchronization

**Sync AnalysisWorkspace now** mirrors non-deleted Workspace content into the
marked `+AnalysisWorkspaces` Project for the current user and group. PNG
results become OMERO Images. Other results, Chats, Methods, Pipelines, and
Notebooks become typed attachments.

Ready input files with `template` anywhere in the filename are also
synchronized under `Templates`. Other source inputs are excluded.
Chat attachment originals are excluded unless **Sync chat attachments to
OMERO AnalysisWorkspaces** is enabled. When enabled, explicit synchronization
stores originals as managed FileAnnotations on the AnalysisWorkspaces Dataset.
Disabling the option removes those managed annotations on the next explicit
synchronization; extracted text and source URLs are never synchronized.

Synchronization is manual and one-way. The browser Workspace is the source of
truth for each explicit synchronization. **Sync AnalysisWorkspace** is on by
default and adds one managed restore snapshot to the synchronized Dataset. A
new or cleared browser automatically restores the newest matching snapshot;
turning the preference off removes that managed snapshot on the next sync.

Identical result bytes are stored only once in the synchronized Dataset, even
when the same PNG or CSV belongs to a Chat and a saved Method, Pipeline, or
Notebook. A managed Key-Value Pair records every originating Workspace item,
so deduplication does not discard provenance.

## Reusing AnalysisWorkspaces

Use **Reuse from +AnalysisWorkspaces** to browse synchronized Datasets and copy
Methods, Pipelines, or Notebooks into the current browser Workspace. Imports
are independent copies and do not modify the library original.

The Analysis Notebook OMERO panel shows only reusable Notebooks. The Analysis
Chat panel can show Methods, Pipelines, and Notebooks.

## Analysis Settings

**Plot + CSV** asks Chat to save both a visual plot and the corresponding
tabular data. This preference is included when settings are synchronized.

**Sync chat attachments to OMERO AnalysisWorkspaces** is off by default. Its
browser value applies to the current user and group across Workspaces, and it
is included by **Sync Settings**.

**Sync AnalysisSettings** is on by default. It restores the latest encrypted
`~AnalysisSettings` bundle on a new or cleared browser; settings are still
uploaded only when **Sync Settings** is explicitly selected.

Use the sun/moon button immediately before **Settings** to switch between the
default dark interface and the BIOMERO-inspired light interface. The selected
theme is remembered in the browser and included in **Sync Settings**.

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
small but may be billed by the provider. When validation succeeds in an OMERO
context that supports Settings synchronization, Analysis synchronizes the
updated profiles and other Settings automatically.

The **Local AI server** panel is collapsed by default. Expand it to detect LM
Studio or Ollama, enter another local OpenAI-compatible URL, select a detected
model, or create a local AI profile.

Use **Sync Settings** to store all profiles in the marked
`~AnalysisSettings` Project and its **AI Settings** Dataset. The settings JSON
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
`~AnalysisSettings` when **Sync Settings** is used.

## Settings synchronization

The **Sync Settings** button synchronizes:

- Analysis Settings
- Every AI profile
- User-added skills

Settings are scoped to the current OMERO user and group. Opening Analysis in
the same group restores the latest synchronized settings when available.

## Privacy and security

- Data analysis and Notebook execution run in the browser.
- Ordinary Workspace input files remain browser-local. AI requests contain
  prompts, generated code, bounded previews and summaries, errors, and—for
  selected Chat attachments only—extracted text or metadata-stripped image
  pixels. Original PDF and DOCX bytes are never sent to the provider.
- API keys synchronized to OMERO are encrypted at rest.
- Custom skills are instructions and can influence Chat behavior. Add skills
  only from sources you trust.
- Notebook HTML and JavaScript output are not executed.

## Troubleshooting

Browser Python starts lazily when Chat, a Method, a Pipeline, a Notebook, or a
database inspection first needs it. Merely opening Analysis, Settings, or a
Notebook does not copy inputs into Python.

If Chat is unavailable, check that the Workspace inputs are ready and that the
active AI profile has an endpoint, model, and any required key. Use **Validate
connection** for specific endpoint, authentication, model, CORS, or
response-format errors.

If synchronization fails, confirm that the selected OMERO group permits
Project/Dataset creation and FileAnnotation creation, then retry after the
session keepalive has renewed the connection. Unexpected server failures show
a short request ID; include it when checking server logs or reporting the
problem.

If a custom URL skill cannot be loaded, use a direct HTTPS Markdown URL or
upload the file. GitHub `blob` URLs are converted to their raw-content form.

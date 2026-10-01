# omero-analysis-notebook

The lightweight, OMERO-independent SDK for authoring and validating portable
OMERO.Analysis notebooks. See the repository developer guide for the protocol,
conversion workflow, and security model.

The SDK wheel is shipped with each tagged OMERO.Analysis GitHub Release;
`manifest.json` records its independent version and checksum. Download the exact
release and verify the wheel before installing. Production distribution uses
GitHub Releases. For SDK development, use `pip install -e ./notebook-sdk` from
an Analysis checkout.

import { inputFileNameMatches, type NotebookProtocolBinding, type NotebookProtocolInput } from "./notebookProtocol";
import type { Attachment } from "./types";

/** Recover only attachments reauthorized in the current source context. */
export function notebookAttachmentCandidates(
  input: NotebookProtocolInput, attachments: Attachment[], previous?: NotebookProtocolBinding
): Attachment[] {
  if (previous?.annotationId) {
    const bound = attachments.find(item => item.annotation_id === previous.annotationId);
    if (bound) {
      return bound.supported && (!previous.originalFileId || bound.file_id === previous.originalFileId)
        && inputFileNameMatches({ ...input, filename_globs: undefined }, bound.name) ? [bound] : [];
    }
  }
  const expectedName = input.path.split(/[\\/]/).at(-1)?.toLowerCase();
  return attachments.filter(item => item.supported && inputFileNameMatches(input, item.name) &&
    (Boolean(input.filename_globs) || item.name.toLowerCase() === expectedName));
}

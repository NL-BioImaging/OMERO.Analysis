class AnalysisError(Exception):
    code = "analysis_error"
    status = 400


class InvalidObject(AnalysisError):
    code = "invalid_object"


class ObjectNotFound(AnalysisError):
    code = "object_not_found"
    status = 404


class AttachmentNotFound(AnalysisError):
    code = "attachment_not_found"
    status = 404


class PermissionDenied(AnalysisError):
    code = "permission_denied"
    status = 403


class InvalidToken(PermissionDenied):
    code = "invalid_context_token"


class FileTooLarge(AnalysisError):
    code = "file_too_large"
    status = 413


class UnsupportedMedia(AnalysisError):
    code = "unsupported_media"
    status = 415


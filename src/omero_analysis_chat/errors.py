class AnalysisChatError(Exception):
    code = "analysis_chat_error"
    status = 400


class InvalidObject(AnalysisChatError):
    code = "invalid_object"


class ObjectNotFound(AnalysisChatError):
    code = "object_not_found"
    status = 404


class AttachmentNotFound(AnalysisChatError):
    code = "attachment_not_found"
    status = 404


class PermissionDenied(AnalysisChatError):
    code = "permission_denied"
    status = 403


class InvalidToken(PermissionDenied):
    code = "invalid_context_token"


class FileTooLarge(AnalysisChatError):
    code = "file_too_large"
    status = 413


class UnsupportedMedia(AnalysisChatError):
    code = "unsupported_media"
    status = 415


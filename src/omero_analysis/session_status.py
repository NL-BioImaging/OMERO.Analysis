"""JSON session status using OMERO's authenticated connector lifecycle."""
from django.http import JsonResponse
from django.urls import NoReverseMatch, reverse


def status_response(authenticated, unavailable=False):
    try:
        login_url = reverse("weblogin")
    except NoReverseMatch:
        login_url = "/webclient/login/"
    response = JsonResponse(
        {"authenticated": None if unavailable else authenticated, "login_url": login_url,
         **({"error": "session_unavailable"} if unavailable else {})},
        status=503 if unavailable else 200 if authenticated else 401,
    )
    response["Cache-Control"] = "no-store"
    return response


try:
    from omeroweb.webclient.decorators import login_required
except ImportError:
    # Unit tests without the optional OMERO runtime supply an explicit conn.
    def session_status_required(function):
        return function
else:
    class SessionStatusRequired(login_required):
        def get_connection(self, server_id, request):
            try:
                return super().get_connection(server_id, request)
            except Exception:
                # Preserve the distinction between a missing login and an
                # unavailable OMERO service. Do not return the exception text.
                request._analysis_session_unavailable = True
                return None

        def on_not_logged_in(self, request, url, error=None):
            return status_response(False, unavailable=bool(
                getattr(request, "_analysis_session_unavailable", False)))

    session_status_required = SessionStatusRequired(allowPublic=False)

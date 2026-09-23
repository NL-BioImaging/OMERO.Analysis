"""Authorization for a user's workspace, independent of source annotation rights."""
from .errors import PermissionDenied
from .services import object_group_id, _plain


def require_workspace_access(conn, obj):
    user_id = int(conn.getUserId())
    group_id = object_group_id(obj)
    if user_id <= 0:
        raise PermissionDenied("An authenticated workspace owner is required")
    if hasattr(conn, "getEventContext") and int(conn.getEventContext().groupId) != group_id:
        raise PermissionDenied("The active OMERO group has changed")
    # Read membership afresh: session membership can outlive revocation.
    if hasattr(conn, "getQueryService"):
        from omero.sys import ParametersI
        rows = conn.getQueryService().projection(
            "SELECT m.parent.id, m.parent.name FROM GroupExperimenterMap m WHERE m.child.id = :user "
            "AND (m.parent.id = :group OR m.parent.name IN ('system', 'user'))",
            ParametersI().addLong("user", user_id).addLong("group", group_id))
        groups = {int(_plain(row[0])) for row in rows}
        roles = {str(_plain(row[1])) for row in rows}
        if "user" not in roles or (group_id not in groups and "system" not in roles):
            raise PermissionDenied("The active user's group access has been revoked")


def can_manage_workspace(conn, obj):
    if conn is None:
        return False
    try:
        require_workspace_access(conn, obj)
        return True
    except PermissionDenied:
        return False

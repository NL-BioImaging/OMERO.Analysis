import pytest

from omero_analysis.errors import PermissionDenied
from omero_analysis.workspace_access import (
    can_manage_workspace,
    require_workspace_access,
)

from .conftest import FakeConnection, FakeObject


def test_root_user_id_zero_is_an_authenticated_workspace_owner():
    obj = FakeObject(group_id=0)
    conn = FakeConnection(obj, user_id=0)

    require_workspace_access(conn, obj)

    assert can_manage_workspace(conn, obj) is True


def test_negative_user_id_is_not_an_authenticated_workspace_owner():
    obj = FakeObject(group_id=0)
    conn = FakeConnection(obj, user_id=-1)

    with pytest.raises(PermissionDenied, match="authenticated workspace owner"):
        require_workspace_access(conn, obj)

    assert can_manage_workspace(conn, obj) is False

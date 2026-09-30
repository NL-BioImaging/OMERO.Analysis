import pytest
from types import SimpleNamespace

from omero_analysis.errors import PermissionDenied
from omero_analysis.workspace_access import (
    can_manage_workspace,
    require_workspace_access,
)

from .conftest import FakeConnection, FakeObject


class RootConnection(FakeConnection):
    def __init__(self, obj, *, active_group=0, admin=True):
        super().__init__(obj, user_id=0)
        self.active_group = active_group
        self.admin = admin

    def getEventContext(self):
        return SimpleNamespace(groupId=self.active_group)

    def isAdmin(self):
        return self.admin

    def getQueryService(self):
        raise AssertionError("Root must not need ordinary user-group membership")


def test_root_user_id_zero_is_an_authenticated_workspace_owner():
    obj = FakeObject(group_id=0)
    conn = RootConnection(obj)

    require_workspace_access(conn, obj)

    assert can_manage_workspace(conn, obj) is True


@pytest.mark.parametrize("group,active_group,admin", [
    (0, 0, False),
    (4, 4, True),
    (0, 4, True),
])
def test_root_requires_system_group_and_active_admin_session(group, active_group, admin):
    obj = FakeObject(group_id=group)
    conn = RootConnection(obj, active_group=active_group, admin=admin)

    with pytest.raises(PermissionDenied):
        require_workspace_access(conn, obj)

    assert can_manage_workspace(conn, obj) is False


def test_negative_user_id_is_not_an_authenticated_workspace_owner():
    obj = FakeObject(group_id=0)
    conn = FakeConnection(obj, user_id=-1)

    with pytest.raises(PermissionDenied, match="authenticated workspace owner"):
        require_workspace_access(conn, obj)

    assert can_manage_workspace(conn, obj) is False

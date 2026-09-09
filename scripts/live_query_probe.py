"""Run inside OMERO.web, reading ephemeral test credentials as JSON on stdin.

Creates only uniquely named synthetic fixtures; removes data and deactivates users in finally.
Never modifies the permissions of pre-existing data or users.
"""
from __future__ import annotations

import hashlib
import json
import os
import secrets
import sys
import tempfile
import uuid
from pathlib import Path
from types import SimpleNamespace


def main():
    credentials = json.load(sys.stdin)
    if credentials.get("disposable_stack") is not True:
        raise RuntimeError("Permission fixtures require a disposable stack; pass disposable_stack: true only for an isolated test stack")
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "omeroweb.settings")
    import django
    django.setup()
    from django.conf import settings
    from django.test import RequestFactory
    from omero.gateway import BlitzGateway, DatasetWrapper
    from omero.model import ExperimenterGroupI, ExperimenterI, PermissionsI, DatasetI
    from omero.rtypes import rstring, rbool
    from omero.sys import ParametersI
    from omero_analysis.data_query import DataQueryBroker, authorize_query_source, make_result_token
    from omero_analysis.data_query_provenance import make_receipt, promote_result
    from omero_analysis.tokens import make_context_token

    root = BlitzGateway("root", credentials["password"], host=credentials.get("host", "omeroserver"), port=4064)
    assert root.connect(), "OMERO administrator connection failed"
    prefix = "dqw-test-" + uuid.uuid4().hex[:10]
    state_root = Path(getattr(settings, "OMERO_ANALYSIS_DATA_QUERY_STATE_DIR", "") or
                      os.getenv("OMERO_ANALYSIS_DATA_QUERY_STATE_DIR", "") or
                      Path(tempfile.gettempdir()) / "omero-analysis-data-query")
    settings.OMERO_ANALYSIS_DATA_QUERY_STATE_DIR = str(state_root / prefix)
    admin = root.getAdminService()
    groups, users, datasets, connections, outcomes = [], [], [], [], []
    created = {"prefix": prefix, "groups": [], "users": [], "datasets": [], "annotations": []}
    journal_path = state_root / (prefix + "-fixture-ids.json")
    journal_path.parent.mkdir(parents=True, exist_ok=True)
    def record(kind, identifier):
        created[kind].append(identifier)
        temporary = journal_path.with_suffix(".tmp")
        temporary.write_text(json.dumps(created, indent=2))
        temporary.replace(journal_path)
    password = secrets.token_urlsafe(24)
    try:
        for label, permissions in [("private", "rw----"), ("read-only", "rwr---"),
                                   ("read-annotate", "rwra--"), ("read-write", "rwrw--")]:
            group = ExperimenterGroupI()
            group.name = rstring(prefix + "-" + label)
            group.ldap = rbool(False)
            group.details.permissions = PermissionsI(permissions)
            group_id = admin.createGroup(group)
            record("groups", group_id)
            groups.append((label, admin.getGroup(group_id)))
        for role in ("owner", "member", "pi"):
            user = ExperimenterI()
            user.omeName = rstring(prefix + "-" + role)
            user.firstName = rstring("Disposable")
            user.lastName = rstring("DataQueryTest")
            user.ldap = rbool(False)
            user_id = admin.createExperimenterWithPassword(user, rstring(password), groups[0][1],
                                                            [admin.lookupGroup("user")] + [g for _, g in groups[1:]])
            record("users", user_id)
            users.append((role, admin.getExperimenter(user_id)))
            conn = BlitzGateway(prefix + "-" + role, password, host=credentials.get("host", "omeroserver"), port=4064)
            connections.append((role, conn))
            assert conn.connect()
        for _, group in groups:
            admin.addGroupOwners(group, [users[2][1]])

        for label, group in groups:
            group_id = group.id.val
            owner = connections[0][1]
            owner.setGroupForSession(group_id)
            dataset = DatasetWrapper(owner, DatasetI())
            dataset.setName(prefix + "-" + label)
            dataset.save()
            record("datasets", {"group": group_id, "id": dataset.getId()})
            datasets.append((group_id, dataset.getId()))
            with tempfile.TemporaryDirectory() as temporary:
                source_path = Path(temporary) / "measurements.csv"
                source_path.write_bytes(b"id,area\n1,10.5\n2,20.5\n")
                annotation = owner.createFileAnnfromLocalFile(str(source_path), mimetype="text/csv", ns=prefix)
                record("annotations", annotation.getId())
                dataset.linkAnnotation(annotation)
            for role, conn in connections + [("admin", root)]:
                conn.setGroupForSession(group_id)
                obj = conn.getObject("Dataset", dataset.getId())
                if label == "private" and role == "member":
                    assert obj is None
                    outcomes.append({"group": label, "role": role, "read": "denied"})
                    continue
                assert obj is not None
                request = RequestFactory().post("/query/")
                request.session = SimpleNamespace(session_key=prefix + "-" + role)
                token, _ = make_context_token(request, conn, "Dataset", obj.getId(), obj, ["data_query"])
                request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = token
                claims, obj, source, info, scope, reference = authorize_query_source(request, conn, annotation_id=annotation.getId())
                broker = DataQueryBroker()
                schema = broker.schema(source, info, scope, reference)
                assert schema["tables"][0]["name"] == "data"
                query = {"sql": "SELECT id, area FROM data WHERE area >= $minimum ORDER BY id",
                         "parameters": {"minimum": {"type": "float", "value": 10.0}}}
                result, identifier = broker.query(source, info, scope, reference, query)
                result_token = make_result_token(request, conn, claims, info, identifier)
                receipt = make_receipt(request, conn, claims, info, result_token, query, result)
                assert receipt, "Enhanced worker must advertise execution provenance"
                authorize_query_source(request, conn, result_token=result_token)
                response = broker.download(identifier)
                try:
                    data = response.content
                    assert data == b"id,area\n1,10.5\n2,20.5\n"
                    assert hashlib.sha256(data).hexdigest() == result["execution"]["result_sha256"]
                finally:
                    response.close()
                can_save = bool(obj.canAnnotate())
                expected_save = (role == "owner" or label in {"read-annotate", "read-write"}
                                 or (label == "read-only" and role in {"pi", "admin"}))
                assert can_save == expected_save, (label, role, can_save)
                before = {a.getId() for a in obj.listAnnotations()}
                if can_save:
                    saved = promote_result(request, conn, {"result_token": result_token, "receipt": receipt})
                    assert saved["result"]["kind"] == "result"
                    assert promote_result(request, conn, {"result_token": result_token, "receipt": receipt})["reused"]
                else:
                    try:
                        promote_result(request, conn, {"result_token": result_token, "receipt": receipt})
                    except Exception as exc:
                        assert getattr(exc, "code", "") == "permission_denied", type(exc).__name__
                    else:
                        raise AssertionError("Promotion bypassed OMERO permissions")
                    assert before == {a.getId() for a in obj.listAnnotations()}
                # Context-bound tokens must not cross browser sessions or active groups.
                original_session = request.session.session_key
                request.session.session_key = "different-session"
                try:
                    authorize_query_source(request, conn, result_token=result_token)
                except Exception:
                    pass
                else:
                    raise AssertionError("Cross-session result accepted")
                request.session.session_key = original_session
                other_group = next(g.id.val for _, g in groups if g.id.val != group_id)
                conn.setGroupForSession(other_group)
                try:
                    authorize_query_source(request, conn, result_token=result_token)
                except Exception:
                    pass
                else:
                    raise AssertionError("Cross-group result accepted")
                conn.setGroupForSession(group_id)
                outcomes.append({"group": label, "role": role, "query": "passed", "promotion": can_save})
            # The last result belongs to root, so change only this synthetic attachment.
            root.setGroupForSession(group_id)
            obj = root.getObject("Dataset", dataset.getId())
            links = root.getQueryService().findAllByQuery(
                "SELECT l FROM DatasetAnnotationLink l WHERE l.parent.id = :parent AND l.child.id = :child",
                ParametersI().addLong("parent", dataset.getId()).addLong("child", annotation.getId()))
            root.deleteObjects("DatasetAnnotationLink", [link.id.val for link in links], wait=True)
            for operation in (
                lambda: authorize_query_source(request, root, result_token=result_token),
                lambda: promote_result(request, root, {"result_token": result_token, "receipt": receipt}),
            ):
                try:
                    operation()
                except Exception:
                    pass
                else:
                    raise AssertionError("Unlinked source accepted")
            root.deleteObjects("Annotation", [annotation.getId()], wait=True)
            outcomes.append({"group": label, "source_unlinked": "download/save denied"})
        # A separate fixture has no cross-user links, allowing a legal permission downgrade.
        group = ExperimenterGroupI()
        group.name, group.ldap = rstring(prefix + "-revocation"), rbool(False)
        group.details.permissions = PermissionsI("rwra--")
        group_id = admin.createGroup(group)
        record("groups", group_id)
        group = admin.getGroup(group_id)
        groups.append(("revocation", group))
        for _, user in users:
            admin.addGroups(user, [group])
        owner, member = connections[0][1], connections[1][1]
        owner.setGroupForSession(group_id)
        dataset = DatasetWrapper(owner, DatasetI())
        dataset.setName(prefix + "-revocation")
        dataset.save()
        record("datasets", {"group": group_id, "id": dataset.getId()})
        datasets.append((group_id, dataset.getId()))
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "source.csv"
            path.write_bytes(b"id\n1\n")
            annotation = owner.createFileAnnfromLocalFile(str(path), mimetype="text/csv", ns=prefix)
            record("annotations", annotation.getId())
            dataset.linkAnnotation(annotation)
        member.setGroupForSession(group_id)
        obj = member.getObject("Dataset", dataset.getId())
        request = RequestFactory().post("/query/")
        request.session = SimpleNamespace(session_key=prefix + "-revocation")
        context, _ = make_context_token(request, member, "Dataset", obj.getId(), obj, ["data_query"])
        request.META["HTTP_X_OMERO_ANALYSIS_CONTEXT"] = context
        claims, obj, source, info, scope, reference = authorize_query_source(request, member, annotation_id=annotation.getId())
        query = {"sql": "SELECT * FROM data", "parameters": {}}
        result, identifier = DataQueryBroker().query(source, info, scope, reference, query)
        result_token = make_result_token(request, member, claims, info, identifier)
        receipt = make_receipt(request, member, claims, info, result_token, query, result)
        root.setGroupForSession(group_id)
        admin.changePermissions(group, PermissionsI("rwr---"))
        authorize_query_source(request, member, result_token=result_token)
        try:
            promote_result(request, member, {"result_token": result_token, "receipt": receipt})
        except Exception as exc:
            assert getattr(exc, "code", "") == "permission_denied"
        else:
            raise AssertionError("Permission downgrade allowed a save")
        assert [a.getId() for a in member.getObject("Dataset", dataset.getId()).listAnnotations()] == [annotation.getId()]
        admin.removeGroups(users[1][1], [group])
        try:
            authorize_query_source(request, member, result_token=result_token)
        except Exception:
            pass
        else:
            raise AssertionError("Revoked group membership allowed a download")
        outcomes.append({"permission_downgrade": "save denied without artifacts", "membership_revoked": "download denied"})
        # Moving this source context invalidates the already-issued result token.
        from omero.callbacks import CmdCallbackI
        destination_group = groups[3][1].id.val
        handle = root.chgrpObjects("Dataset", [dataset.getId()], destination_group)
        callback = CmdCallbackI(root.c, handle)
        try:
            callback.loop(30, 500)
            assert not callback.getResponse().__class__.__name__.endswith("ERR")
        finally:
            callback.close(True)
        datasets[-1] = (destination_group, dataset.getId())
        admin.addGroups(users[1][1], [group])
        for current_group in (group_id, destination_group):
            member.setGroupForSession(current_group)
            try:
                authorize_query_source(request, member, result_token=result_token)
            except Exception:
                pass
            else:
                raise AssertionError("Moved context accepted an old result token")
        outcomes.append({"group_move": "old token denied in both groups"})

        # A web-like gateway joins a session without retaining the user's password.
        joined = BlitzGateway(host=credentials.get("host", "omeroserver"), port=4064)
        session = member.getSession()
        assert joined.connect(sUuid=session.uuid.val)
        connections.append(("joined", joined))
        for _ in range(4):
            if root.getSessionService().closeSession(session) <= 0:
                break
        try:
            joined.getQueryService().projection("SELECT e.id FROM Experimenter e WHERE e.id = :id",
                                               ParametersI().addLong("id", member.getUserId()))
        except Exception:
            pass
        else:
            raise AssertionError("Revoked OMERO session still accepted requests")
        outcomes.append({"session_revoked": "joined gateway denied"})
        print(json.dumps({"prefix": prefix, "cases": outcomes, "status": "passed"}, indent=2))
    finally:
        for _, conn in connections:
            conn.close()
        cleanup_errors = []
        for group_id, dataset_id in datasets:
            try:
                root.setGroupForSession(group_id)
                obj = root.getObject("Dataset", dataset_id)
                if obj:
                    annotation_ids = [a.getId() for a in obj.listAnnotations()]
                    if annotation_ids:
                        root.deleteObjects("Annotation", annotation_ids, wait=True)
                    root.deleteObjects("Dataset", [dataset_id], wait=True)
            except Exception as exc:
                cleanup_errors.append(str(getattr(exc, "message", type(exc).__name__)))
        # Also clean annotations created before a failed link operation.
        for identifier in created["annotations"]:
            try:
                root.setGroupForSession(-1)
                annotation = root.getObject("Annotation", identifier)
                if annotation is not None:
                    root.setGroupForSession(annotation.getDetails().getGroup().getId())
                    root.deleteObjects("Annotation", [identifier], wait=True)
            except Exception as exc:
                cleanup_errors.append(type(exc).__name__)
        for _, user in reversed(users):
            try:
                # OMERO retains immutable session/event history for users who logged in.
                # Removing membership of the built-in user group disables future login.
                admin.removeGroups(user, [admin.lookupGroup("user")])
            except Exception as exc:
                cleanup_errors.append(str(getattr(exc, "message", type(exc).__name__)))
        # Partial setup may have created an account before its wrapper/connection was recorded.
        known = {user.id.val for _, user in users}
        for identifier in created["users"]:
            if identifier not in known:
                try:
                    admin.removeGroups(admin.getExperimenter(identifier), [admin.lookupGroup("user")])
                except Exception as exc:
                    cleanup_errors.append(type(exc).__name__)
        created["cleanup_errors"] = cleanup_errors
        created["teardown"] = "data cleanup attempted; accounts retained disabled; destroy disposable stack"
        journal_path.write_text(json.dumps(created, indent=2))
        root.close()
        if cleanup_errors:
            raise RuntimeError(f"Fixture cleanup incomplete for {prefix}: {cleanup_errors}")


if __name__ == "__main__":
    main()

"""Small shared helpers for OMERO-managed containers and annotations."""


def plain(value):
    if value is None:
        return None
    return getattr(value, "val", value)


def user_id(conn):
    try:
        return int(conn.getUserId())
    except (AttributeError, TypeError, ValueError):
        return 0


def delete_object(conn, object_type, object_id):
    conn.deleteObjects(object_type, [int(object_id)], wait=True)


def project_datasets(project):
    try:
        return list(project.listChildren())
    except (AttributeError, TypeError):
        return []


def annotations(obj):
    try:
        return list(obj.listAnnotations())
    except (AttributeError, TypeError):
        return []


def map_values(annotation):
    try:
        return {
            str(plain(key)): str(plain(value))
            for key, value in annotation.getValue()
        }
    except (AttributeError, TypeError, ValueError):
        return {}


def marker(obj, namespace, role=None, match=None):
    for annotation in annotations(obj):
        if str(plain(getattr(annotation, "getNs", lambda: None)())) != namespace:
            continue
        values = map_values(annotation)
        if (
            (not role or values.get("role") == role)
            and all(values.get(key) == str(value) for key, value in (match or {}).items())
        ):
            return annotation, values
    return None, {}


def set_marker(conn, obj, namespace, values, role, match=None):
    annotation, current = marker(obj, namespace, role, match)
    payload = {
        **current,
        **{key: str(value) for key, value in values.items()},
        "role": role,
    }
    pairs = sorted(payload.items())
    if annotation is None:
        from omero.gateway import MapAnnotationWrapper

        annotation = MapAnnotationWrapper(conn)
        annotation.setNs(namespace)
        annotation.setValue(pairs)
        annotation.save()
        obj.linkAnnotation(annotation)
    else:
        annotation.setValue(pairs)
        annotation.save()
    return annotation


def owned_projects(conn):
    try:
        return list(conn.getObjects("Project", opts={"owner": user_id(conn)}))
    except (AttributeError, TypeError):
        return []


def create_project(conn, name, description):
    from omero.gateway import ProjectWrapper
    from omero.model import ProjectI

    project = ProjectWrapper(conn, ProjectI())
    project.setName(name)
    project.setDescription(description)
    project.save()
    return project


def create_dataset(conn, name, description):
    from omero.gateway import DatasetWrapper
    from omero.model import DatasetI

    dataset = DatasetWrapper(conn, DatasetI())
    dataset.setName(name)
    dataset.setDescription(description)
    dataset.save()
    return dataset


def link_dataset(conn, project, dataset):
    from omero.model import ProjectDatasetLinkI

    link = ProjectDatasetLinkI()
    link.setParent(project._obj.__class__(project._obj.id, False))
    link.setChild(dataset._obj.__class__(dataset._obj.id, False))
    conn.getUpdateService().saveObject(link, conn.SERVICE_OPTS)

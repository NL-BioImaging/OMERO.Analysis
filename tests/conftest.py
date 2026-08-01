from types import SimpleNamespace

import django
from django.conf import settings


def pytest_configure():
    if not settings.configured:
        settings.configure(
            SECRET_KEY="analysis-tests",
            ROOT_URLCONF="omero_analysis.urls",
            ALLOWED_HOSTS=["testserver"],
            MIDDLEWARE=[],
            INSTALLED_APPS=[
                "django.contrib.auth",
                "django.contrib.contenttypes",
                "omero_analysis",
            ],
            TEMPLATES=[
                {
                    "BACKEND": "django.template.backends.django.DjangoTemplates",
                    "APP_DIRS": True,
                }
            ],
            OMERO_ANALYSIS_CONTEXT_TTL_SECONDS=60,
            OMERO_ANALYSIS_MAX_DOWNLOAD_BYTES=1024,
            OMERO_ANALYSIS_MAX_UPLOAD_BYTES=1024,
        )
        django.setup()


class Value:
    def __init__(self, value):
        self.val = value


class FakeOriginalFile:
    def __init__(self, file_id, name, size=12, mimetype="application/octet-stream"):
        self.file_id = file_id
        self.name = name
        self.size = size
        self.mimetype = mimetype

    def getId(self):
        return self.file_id

    def getName(self):
        return self.name

    def getSize(self):
        return self.size

    def getMimetype(self):
        return self.mimetype


class FakeAnnotation:
    def __init__(self, annotation_id, name, data=b"data", namespace=None):
        self.annotation_id = annotation_id
        self.data = data
        self.namespace = namespace
        self.file = FakeOriginalFile(annotation_id + 100, name, len(data))

    def getId(self):
        return self.annotation_id

    def getFile(self):
        return self.file

    def getFileInChunks(self):
        yield self.data

    def getNs(self):
        return self.namespace


class FakeObject:
    def __init__(self, object_id=1, name="Selected", annotations=None, can_annotate=True, group_id=4):
        self.object_id = object_id
        self.name = name
        self.annotations = annotations or []
        self.can_annotate_value = can_annotate
        self.group_id = group_id
        self.linked = []

    def getName(self):
        return self.name

    def listAnnotations(self):
        return list(self.annotations) + [
            annotation for annotation in self.linked if annotation not in self.annotations
        ]

    def canAnnotate(self):
        return self.can_annotate_value

    def getDetails(self):
        group = SimpleNamespace(getId=lambda: self.group_id)
        return SimpleNamespace(getGroup=lambda: group)

    def linkAnnotation(self, annotation):
        if annotation not in self.linked:
            self.linked.append(annotation)

    def unlinkAnnotation(self, annotation):
        if annotation in self.annotations:
            self.annotations.remove(annotation)
        if annotation in self.linked:
            self.linked.remove(annotation)


class FakeConnection:
    def __init__(self, obj=None, user_id=7):
        self.obj = obj or FakeObject()
        self.user_id = user_id
        self.created = None
        self.deleted = []

    def getObject(self, object_type, object_id):
        if int(object_id) == self.obj.object_id:
            return self.obj
        return None

    def getUserId(self):
        return self.user_id

    def createFileAnnfromLocalFile(self, path, mimetype, ns, desc):
        from pathlib import Path

        self.created = FakeAnnotation(901, Path(path).name, Path(path).read_bytes(), ns)
        self.created.file.mimetype = mimetype
        return self.created

    def deleteObjects(self, object_type, ids, wait=True):
        self.deleted.append((object_type, ids, wait))

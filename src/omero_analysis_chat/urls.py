from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r"^$", views.chat, name="omero_analysis_chat_index"),
    re_path(
        r"^runtime/(?P<asset_path>[-\w./]+)$",
        views.runtime_asset,
        name="omero_analysis_chat_runtime_asset",
    ),
    re_path(
        r"^panel/(?P<object_type>\w+)/(?P<object_id>\d+)/$",
        views.panel,
        name="omero_analysis_chat_panel",
    ),
    re_path(r"^api/context-token/$", views.context_token, name="omero_analysis_chat_token"),
    re_path(
        r"^api/context/(?P<object_type>\w+)/(?P<object_id>\d+)/$",
        views.context,
        name="omero_analysis_chat_context",
    ),
    re_path(
        r"^api/attachments/(?P<object_type>\w+)/(?P<object_id>\d+)/$",
        views.attachments,
        name="omero_analysis_chat_attachments",
    ),
    re_path(
        r"^api/attachment/(?P<annotation_id>\d+)/download/$",
        views.download_attachment,
        name="omero_analysis_chat_download",
    ),
    re_path(
        r"^api/attachments/(?P<object_type>\w+)/(?P<object_id>\d+)/upload/$",
        views.upload_result,
        name="omero_analysis_chat_upload",
    ),
    re_path(
        r"^api/projects/(?P<object_type>\w+)/(?P<object_id>\d+)/snapshots/$",
        views.project_snapshots,
        name="omero_analysis_chat_project_snapshots",
    ),
    re_path(
        r"^api/project-snapshot/(?P<annotation_id>\d+)/download/$",
        views.download_project_snapshot,
        name="omero_analysis_chat_project_snapshot_download",
    ),
]

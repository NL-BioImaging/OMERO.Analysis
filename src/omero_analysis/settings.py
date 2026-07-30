from django.conf import settings


PREFIX = "omero.web.analysis."
DEFAULT_EXTENSIONS = (
    ".csv,.tsv,.json,.xlsx,.xls,.parquet,.npy,.npz,.duckdb,.sqlite,.sqlite3,"
    ".png,.svg,.pdf,.txt,.md"
)


def _setting(name, default):
    django_name = f"OMERO_ANALYSIS_{name.upper()}"
    if hasattr(settings, django_name):
        return getattr(settings, django_name)
    try:
        from omeroweb.settings import omero_settings

        return omero_settings.get(PREFIX + name, default)
    except Exception:
        # A standalone Django process can have omero-web installed without the
        # OMERO deployment environment needed to import omeroweb.settings.
        return default


def context_ttl_seconds():
    return int(_setting("context_ttl_seconds", 10800))


def max_download_bytes():
    return int(_setting("max_download_bytes", 2147483648))


def max_upload_bytes():
    return int(_setting("max_upload_bytes", 268435456))


def max_notebook_bytes():
    return int(_setting("max_notebook_bytes", 32 * 1024 * 1024))


def max_notebook_cells():
    return int(_setting("max_notebook_cells", 10000))


def max_sync_items():
    return int(_setting("max_sync_items", 10000))


def max_sync_changed_bytes():
    return int(_setting("max_sync_changed_bytes", 512 * 1024 * 1024))


def max_png_pixels():
    return int(_setting("max_png_pixels", 100_000_000))


def allowed_result_extensions():
    value = _setting("allowed_result_extensions", DEFAULT_EXTENSIONS)
    if isinstance(value, str):
        values = value.split(",")
    else:
        values = value
    return {str(item).strip().lower() for item in values if str(item).strip()}

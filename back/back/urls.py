"""
URL configuration for back project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.db import connection
import os
from pathlib import Path


def db_check(request):
    """Diagnostic endpoint - shows which database Django is connected to."""
    db = connection.settings_dict
    backend_root = Path(__file__).resolve().parent.parent
    return JsonResponse({
        "engine": db.get("ENGINE", ""),
        "name": str(db.get("NAME", "")),
        "host": db.get("HOST", "localhost (sqlite)"),
        "database_url_source": next((
            key for key in (
                "DATABASE_URL",
                "POSTGRES_URL",
                "POSTGRES_PRISMA_URL",
                "POSTGRES_URL_NON_POOLING",
            )
            if os.getenv(key)
        ), None),
        "is_neondb": "neon.tech" in str(db.get("HOST", "")),
        "env_files_found": {
            "project_root": (backend_root.parent / ".env").exists(),
            "backend_root": (backend_root / ".env").exists(),
            "render_secret": os.path.exists("/etc/secrets/.env"),
        },
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('db-check/', db_check, name='db_check'),  # diagnostic - remove after confirmed working
    path('api/', include('loginSignup.urls')),
    path('api/', include('app.urls')),
    path('', include('app.urls')),
    path('profile/', include('dashboard.urls')),
    path('photo/', include('photo.urls')),
    path('support/', include('support.urls')),
    path("api/subsidy_provider/", include('subsidy_provider.urls')),
    path('api/subsidy-recommendations/', include('SubsidyRecommandation.urls')),
    path('subsidy/', include("subsidy.urls")),
    path('news/', include('news_post.urls')),
    path("notify/", include("notifications.urls")),
]

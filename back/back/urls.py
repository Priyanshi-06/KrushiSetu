"""
URL configuration for back project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.db import connection
import os


def db_check(request):
    """Diagnostic endpoint - shows which database Django is connected to."""
    db = connection.settings_dict
    return JsonResponse({
        "engine": db.get("ENGINE", ""),
        "name": str(db.get("NAME", "")),
        "host": db.get("HOST", "localhost (sqlite)"),
        "database_url_set": bool(os.getenv("DATABASE_URL")),
        "is_neondb": "neon.tech" in str(db.get("HOST", "")),
        "env_file_found": os.path.exists("/etc/secrets/.env"),
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

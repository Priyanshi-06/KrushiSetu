"""
Fix script: The NeonDB already has the full production schema applied.
This script checks which migrations are recorded in django_migrations vs
which migration files exist, and fake-inserts all missing migration records
so Django doesn't try to re-apply DDL that already exists.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "back.settings")
django.setup()

from django.db import connection
from django.utils import timezone
from django.apps import apps
from django.db.migrations.loader import MigrationLoader

loader = MigrationLoader(connection, ignore_no_migrations=True)

# Get all migrations that are on disk
disk_migrations = set(loader.disk_migrations.keys())  # set of (app_label, name)

# Get all migrations already recorded in DB
with connection.cursor() as cursor:
    cursor.execute("SELECT app, name FROM django_migrations")
    applied_migrations = set(cursor.fetchall())

print(f"Total migrations on disk: {len(disk_migrations)}")
print(f"Total migrations in DB:   {len(applied_migrations)}")

missing = disk_migrations - applied_migrations
print(f"\nMissing from DB ({len(missing)} migrations):")
for app, name in sorted(missing):
    print(f"  {app}.{name}")

if missing:
    print("\nInserting missing migration records as fake-applied...")
    now = timezone.now()
    with connection.cursor() as cursor:
        for app, name in sorted(missing):
            cursor.execute(
                """
                INSERT INTO django_migrations (app, name, applied)
                VALUES (%s, %s, %s)
                ON CONFLICT DO NOTHING
                """,
                [app, name, now],
            )
            print(f"  [OK] Inserted {app}.{name}")
    print("\nDone. All migrations marked as applied.")
else:
    print("\nNo missing migrations. DB is already in sync.")

print("\nFinal migration state:")
with connection.cursor() as cursor:
    cursor.execute(
        "SELECT app, name FROM django_migrations ORDER BY app, name"
    )
    for row in cursor.fetchall():
        print(f"  [X] {row[0]}.{row[1]}")

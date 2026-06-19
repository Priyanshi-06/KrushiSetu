#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py shell -c "from django.conf import settings; db=settings.DATABASES['default']; print(f\"[DB] engine={db.get('ENGINE')} host={db.get('HOST')} name={db.get('NAME')}\")"
python manage.py migrate --no-input

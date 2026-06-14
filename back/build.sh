#!/usr/bin/env bash
set -o errexit

echo "[BUILD] 📦 Installing dependencies..."
pip install -r requirements.txt

echo "[BUILD] 🗂️  Collecting static files..."
python manage.py collectstatic --no-input

echo "[BUILD] 🔍 Database Configuration:"
python manage.py shell -c "from django.conf import settings; db=settings.DATABASES['default']; print(f\"   ENGINE: {db.get('ENGINE')}\"); print(f\"   HOST: {db.get('HOST', 'N/A')}\"); print(f\"   NAME: {db.get('NAME')}\"); print(f\"   PORT: {db.get('PORT', 'N/A')}\")"

echo "[BUILD] 🔄 Running database migrations..."
python manage.py migrate --no-input --verbosity 2

echo "[BUILD] ✅ Build completed successfully!"

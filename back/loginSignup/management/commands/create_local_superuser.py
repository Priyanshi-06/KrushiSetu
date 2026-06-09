import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create a superuser from SUPERUSER_* variables in .env"

    def handle(self, *args, **options):
        User = get_user_model()
        email = os.getenv("SUPERUSER_EMAIL")
        password = os.getenv("SUPERUSER_PASSWORD")
        full_name = os.getenv("SUPERUSER_FULL_NAME", "Admin")
        mobile_number = os.getenv("SUPERUSER_MOBILE") or None

        if not email or not password:
            self.stderr.write(
                self.style.ERROR(
                    "Set SUPERUSER_EMAIL and SUPERUSER_PASSWORD in back/.env"
                )
            )
            return

        if User.objects.filter(email_address=email).exists():
            self.stdout.write(
                self.style.WARNING(f"Superuser already exists: {email}")
            )
            return

        User.objects.create_superuser(
            full_name=full_name,
            email_address=email,
            password=password,
            mobile_number=mobile_number,
        )
        self.stdout.write(self.style.SUCCESS(f"Superuser created: {email}"))

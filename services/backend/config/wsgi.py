import os
from django.core.wsgi import get_wsgi_application

_env = os.environ.get("DEPLOYMENT_ENV", "development").lower()
_settings = "config.settings.production" if _env == "production" else "config.settings.development"
os.environ.setdefault("DJANGO_SETTINGS_MODULE", _settings)

application = get_wsgi_application()

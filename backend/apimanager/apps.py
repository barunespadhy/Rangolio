from django.apps import AppConfig


class ApimanagerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apimanager'

    def ready(self):
        import apimanager.check_updates

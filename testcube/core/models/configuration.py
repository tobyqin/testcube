from django.db import models


class Configuration(models.Model):
    key = models.CharField(max_length=100)
    value = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def get(key, default=None):
        try:
            return Configuration.objects.get(key=key).value
        except Configuration.DoesNotExist:
            return default

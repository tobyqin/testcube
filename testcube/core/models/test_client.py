from django.db import models


class TestClient(models.Model):
    name = models.CharField(max_length=100)
    ip = models.CharField(max_length=50)
    platform = models.CharField(max_length=100)
    owner = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default='Ready')
    detail = models.TextField(blank=True)

    def __str__(self):
        return self.name

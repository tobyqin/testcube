from django.db import models


class TestClient(models.Model):
    name = models.CharField(max_length=100)
    ip = models.CharField(max_length=50)
    platform = models.CharField(max_length=100)
    owner = models.CharField(50)
    status = models.CharField(50)
    detail = models.TextField()

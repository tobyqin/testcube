from django.db import models


class TestCase(models.Model):
    name = models.CharField(max_length=200)
    keyword = models.CharField(max_length=100)
    priority = models.IntegerField(default=2)
    description = models.CharField(max_length=1000)
    owner = models.CharField(50)
    created_by = models.CharField(50)
    created_on = models.DateTimeField(auto_now_add=True)

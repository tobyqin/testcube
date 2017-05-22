from django.db import models

class TestRun(models.Model):
    name = models.CharField(max_length=500)
    create_on = models.DateTimeField(auto_now_add=True)

class TestCase(models.Model):
    name = models.CharField(max_length=500)
    created_on = models.DateTimeField(auto_now_add=True)

"""
Stands for a run configuration, user can use it to start a new run easily.
"""
from django.db import models


class RunProfile(models.Model):
    name = models.CharField(max_length=50)
    keywords = models.CharField(max_length=100)
    command = models.CharField(max_length=200)

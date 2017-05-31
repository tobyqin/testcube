from django.db import models


class Issue(models.Model):
    name = models.CharField(max_length=100)  # issue id in system, e.g. ECS-1234
    summary = models.CharField(max_length=500)
    created_by = models.CharField(max_length=50, blank=True)
    assigned_to = models.CharField(max_length=50, blank=True)
    created_on = models.DateTimeField(blank=True)
    status = models.CharField(max_length=50, blank=True)
    link = models.CharField(max_length=300, blank=True)
    is_synced = models.BooleanField(default=False)

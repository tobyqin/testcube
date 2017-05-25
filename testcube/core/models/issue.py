from django.db import models


class Issue(models.Model):
    name = models.CharField(max_length=100)  # issue id in system, e.g. ECS-1234
    summary = models.CharField(max_length=500)
    created_by = models.CharField(max_length=50)
    assigned_to = models.CharField(max_length=50)
    created_on = models.DateTimeField()
    status = models.CharField(max_length=50)
    link = models.CharField(max_length=300)
    is_synced = models.BooleanField(default=False)

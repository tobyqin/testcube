from django.db import models
from .project import Project
from .run_status import RunStatus
from django.utils import timezone


class TestRun(models.Model):
    name = models.CharField(200)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    owner = models.CharField(50)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField()
    start_by = models.CharField(50)
    status = models.ForeignKey(RunStatus, on_delete=models.PROTECT)

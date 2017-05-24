from django.db import models
from .issue import Issue


class ResultAnalysis(models.Model):
    by = models.CharField(max_length=50)
    reason = models.TextField()
    issue = models.ForeignKey(Issue, on_delete=models.PROTECT)

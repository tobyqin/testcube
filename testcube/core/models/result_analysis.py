from django.db import models
from .issue import Issue


class ResultAnalysis(models.Model):
    by = models.CharField(max_length=50)
    reason = models.CharField(max_length=100)
    description = models.TextField()
    issue = models.ForeignKey(Issue, on_delete=models.PROTECT)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField()

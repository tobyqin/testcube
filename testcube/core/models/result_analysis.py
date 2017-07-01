from django.db import models

from .issue import Issue


class ResultAnalysis(models.Model):
    REASON_CHOICES = ((0, 'Product defect'), (1, 'Testcase defect'), (2, 'Environment issue'))

    by = models.CharField(max_length=50)
    reason = models.IntegerField(default=0, choices=REASON_CHOICES)
    description = models.TextField(blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    issue = models.ForeignKey(Issue,
                              on_delete=models.PROTECT,
                              null=True,
                              blank=True,
                              related_name='analysis')

    class Meta:
        ordering = ['-updated_on']

    def __str__(self):
        return self.reason

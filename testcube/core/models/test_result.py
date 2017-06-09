from django.db import models

from .result_analysis import ResultAnalysis
from .test_case import TestCase
from .test_client import TestClient
from .test_run import TestRun


class TestResult(models.Model):
    OUTCOME_CHOICES = ((0, 'Passed'), (1, 'Failed'), (2, 'Aborted'), (3, 'Skipped'), (4, 'manual passed'))

    test_run = models.ForeignKey(TestRun, on_delete=models.CASCADE)
    testcase = models.ForeignKey(TestCase, on_delete=models.PROTECT)
    outcome = models.IntegerField(choices=OUTCOME_CHOICES)
    output = models.TextField(default='...')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    assigned_to = models.CharField(max_length=50)
    is_rerun = models.BooleanField(default=False)
    test_client = models.ForeignKey(TestClient, on_delete=models.PROTECT)
    analysis = models.ForeignKey(ResultAnalysis, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return self.id

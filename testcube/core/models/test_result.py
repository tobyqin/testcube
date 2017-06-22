from datetime import timedelta

from django.db import models

from .result_analysis import ResultAnalysis
from .result_error import ResultError
from .test_case import TestCase
from .test_client import TestClient
from .test_run import TestRun


class TestResult(models.Model):
    OUTCOME_CHOICES = ((0, 'Passed'), (1, 'Failed'), (2, 'Skipped'), (3, 'Error'), (4, 'Manual Passed'))

    test_run = models.ForeignKey(TestRun, on_delete=models.CASCADE)
    testcase = models.ForeignKey(TestCase, on_delete=models.CASCADE)
    outcome = models.IntegerField(choices=OUTCOME_CHOICES)
    error = models.ForeignKey(ResultError, on_delete=models.SET_NULL, null=True, blank=True)
    stdout = models.TextField(default=None, null=True, blank=True)
    duration = models.DurationField(default=timedelta())
    assigned_to = models.CharField(max_length=50)
    is_rerun = models.BooleanField(default=False)
    test_client = models.ForeignKey(TestClient, on_delete=models.PROTECT)
    analysis = models.ForeignKey(ResultAnalysis, on_delete=models.SET_NULL, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def run_info(self):
        return {'id': self.test_run.id, 'name': self.test_run.name}

    def testcase_info(self):
        return {'id': self.testcase.id, 'name': self.testcase.name}

    class Meta:
        ordering = ['created_on']

    def __str__(self):
        return '{}'.format(self.id)

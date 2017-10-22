from datetime import timedelta

from django.db import models

from .test_result import TestResult, ResultError, OUTCOME_CHOICES, TestClient


class ResetResult(models.Model):
    RERUN_STATUS = ((0, 'None'), (1, 'In Progress'), (2, 'Done'), (3, 'Failed'))

    outcome = models.IntegerField(choices=OUTCOME_CHOICES, default=5)
    stdout = models.TextField(default=None, null=True, blank=True)
    duration = models.DurationField(default=timedelta())

    reset_on = models.DateTimeField(auto_now_add=True)
    run_on = models.DateTimeField(null=True, blank=True)
    reset_by = models.CharField(max_length=50, blank=True)
    reset_reason = models.CharField(max_length=200, blank=True)
    reset_status = models.IntegerField(choices=RERUN_STATUS, default=0)

    test_client = models.ForeignKey(TestClient, on_delete=models.PROTECT,
                                    null=True, blank=True, related_name='reset_results')
    error = models.OneToOneField(ResultError, on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='reset_result')

    origin_result = models.ForeignKey(TestResult, on_delete=models.CASCADE,
                                      related_name='reset_results')

    class Meta:
        ordering = ['-reset_on']

    def __str__(self):
        return '{}'.format(self.id)

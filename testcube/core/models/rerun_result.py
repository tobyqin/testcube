from datetime import timedelta

from django.db import models

from .test_result import TestResult, ResultError, OUTCOME_CHOICES


class RerunResult(models.Model):
    RERUN_STATUS = ((0, 'None'), (1, 'In Progress'), (2, 'Done'), (3, 'Failed'))

    outcome = models.IntegerField(choices=OUTCOME_CHOICES)
    stdout = models.TextField(default=None, null=True, blank=True)
    duration = models.DurationField(default=timedelta())
    created_on = models.DateTimeField(auto_now_add=True)

    rerun_on = models.DateTimeField(null=True, blank=True)
    rerun_by = models.CharField(max_length=50, blank=True)
    rerun_status = models.IntegerField(choices=RERUN_STATUS, default=0)

    error = models.OneToOneField(ResultError, on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='result')

    origin_result = models.ForeignKey(TestResult, on_delete=models.CASCADE,
                                      related_name='rerun_results')

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return '{}'.format(self.id)

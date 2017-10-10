from datetime import timedelta

from django.core.exceptions import ObjectDoesNotExist
from django.db import models

from .result_analysis import ResultAnalysis
from .result_error import ResultError
from .test_case import TestCase
from .test_client import TestClient
from .test_run import TestRun

OUTCOME_CHOICES = ((0, 'Passed'), (1, 'Failed'),
                   (2, 'Skipped'), (3, 'Error'),
                   (4, 'Manual Passed'), (5, 'Pending'))


class TestResult(models.Model):
    outcome = models.IntegerField(choices=OUTCOME_CHOICES)
    stdout = models.TextField(default=None, null=True, blank=True)
    duration = models.DurationField(default=timedelta())
    assigned_to = models.CharField(max_length=50)
    created_on = models.DateTimeField(auto_now_add=True)

    test_run = models.ForeignKey(TestRun, on_delete=models.CASCADE, related_name='results')
    testcase = models.ForeignKey(TestCase, on_delete=models.CASCADE, related_name='results')
    test_client = models.ForeignKey(TestClient, on_delete=models.PROTECT, related_name='results')

    analysis = models.OneToOneField(ResultAnalysis, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name='result')

    error = models.OneToOneField(ResultError, on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='result')

    def run_info(self):
        return {'id': self.test_run.id,
                'name': self.test_run.name,
                'start_time': self.test_run.start_time}

    def testcase_info(self):
        return {'id': self.testcase.id,
                'name': self.testcase.name}

    def testcase_name(self):
        return self.testcase.name

    def testcase_exec_info(self):
        return self.testcase.execution_info()

    def stability(self):
        return self.testcase.stability()

    def error_message(self):
        if self.error:
            return self.error.message

    def reason(self):
        if self.analysis:
            return self.analysis.get_reason_display()

    def issue_id(self):
        if self.analysis:
            if self.analysis.issue:
                return self.analysis.issue.name

    def files(self):
        from .result_file import ResultFile
        files = ResultFile.objects.filter(run=self.test_run, name__contains=self.testcase.name)
        return [{
            'name': f.name,
            'url': f.file.url,
            'time': f.file_created_time,
            'size': f.file_size()
        } for f in files]

    def is_reset_in_progress(self):
        """check reset in progress or not."""
        return False

    def get_reset_profile(self):
        try:
            return self.testcase.product.runner_profile
        except ObjectDoesNotExist:
            return None

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return '{}'.format(self.id)

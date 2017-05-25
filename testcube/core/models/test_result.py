from django.db import models
from .test_run import TestRun
from .test_case import TestCase
from .test_client import TestClient
from .result_analysis import ResultAnalysis


class TestResult(models.Model):
    test_run = models.ForeignKey(TestRun, on_delete=models.CASCADE)
    testcase = models.ForeignKey(TestCase, on_delete=models.PROTECT)
    outcome = models.IntegerField()
    output = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    assigned_to = models.CharField(max_length=50)
    is_rerun = models.BooleanField(default=False)
    test_client = models.ForeignKey(TestClient,on_delete=models.PROTECT)
    analysis = models.ForeignKey(ResultAnalysis, on_delete=models.SET_NULL)

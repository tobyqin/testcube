from django.db import models

from .test_result import TestResult


class ResultFile(models.Model):
    name = models.CharField(max_length=1000)
    path = models.CharField(max_length=2000)
    result = models.ForeignKey(TestResult, on_delete=models.CASCADE, related_name='files')
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return '{}'.format(self.name)

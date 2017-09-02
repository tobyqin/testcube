from django.db import models

from .test_run import TestRun


class ResultFile(models.Model):
    name = models.CharField(max_length=1000)
    path = models.CharField(max_length=2000)
    created_on = models.DateTimeField(auto_now_add=True)

    run = models.ForeignKey(TestRun, on_delete=models.CASCADE, related_name='files')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return '{}'.format(self.name)

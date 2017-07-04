from django.db import models

from .test_run import TestRun


class RunSource(models.Model):
    link = models.CharField(max_length=1000)
    name = models.CharField(max_length=200)
    run = models.OneToOneField(TestRun, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return '{}'.format(self.link)

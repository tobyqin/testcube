from django.db import models


class ResultError(models.Model):
    exception_type = models.CharField(max_length=100)
    message = models.TextField(null=True, blank=True)
    stacktrace = models.TextField(null=True, blank=True)
    stdout = models.TextField(null=True, blank=True)
    stderr = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.exception_type

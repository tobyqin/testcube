from django.db import models


class ResultError(models.Model):
    message = models.CharField(max_length=1000)
    stacktrace = models.TextField(null=True, blank=True)
    stdout = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.id

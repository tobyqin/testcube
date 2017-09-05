from django.db import models

from .test_run import TestRun


def run_file_dir(instance, filename):
    return 'runs/{}/{}'.format(instance.run.id, filename)


class ResultFile(models.Model):
    name = models.CharField(max_length=1000)
    file = models.FileField(upload_to=run_file_dir)
    file_created_time = models.DateTimeField(auto_now_add=True)
    file_byte_size = models.IntegerField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)

    run = models.ForeignKey(TestRun, on_delete=models.CASCADE, related_name='files')

    def file_size(self):
        return '{} kb'.format(self.file_byte_size / 1024)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return '{}'.format(self.name)

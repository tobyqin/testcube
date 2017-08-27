from django.db import models

from testcube.core.models import Product


class RunnerProfile(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='runner_profile')
    command = models.CharField(max_length=200)


class Task(models.Model):
    STATUS_CHOICES = ((-1, 'Pending'), (0, 'Send'), (1, 'Completed'), (2, 'Abandoned'))

    name = models.CharField(max_length=100)
    status = models.IntegerField(choices=STATUS_CHOICES, default=-1)
    retry_count = models.IntegerField(default=1)
    data = models.TextField()

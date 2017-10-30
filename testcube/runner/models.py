from django.db import models

from testcube.core.models import Product, TestRun


class RunVariables(models.Model):
    test_run = models.OneToOneField(TestRun, on_delete=models.CASCADE, related_name='run_variables')
    data = models.TextField(null=True, default=None)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)


class Profile(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='runner_profile')
    command = models.CharField(max_length=1000)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)


class Task(models.Model):
    STATUS_CHOICES = ((-1, 'Pending'), (0, 'Sent'), (1, 'Error'))

    object_name = models.CharField(max_length=100)
    object_id = models.IntegerField(default=-1)
    description = models.CharField(max_length=200)
    status = models.IntegerField(choices=STATUS_CHOICES, default=-1)
    command = models.CharField(max_length=1000)
    data = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

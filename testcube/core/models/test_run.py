from django.db import models
from django.utils import timezone
from .product import Product
from .project import Project


class TestRun(models.Model):
    STATUS_CHOICES = ((0, 'Passed'), (1, 'Analysis Required'), (2, 'Analyzed'), (3, 'Abandoned'))
    STATE_CHOICES = ((0, 'Starting'), (1, 'Running'), (2, 'Aborted'), (3, 'Completed'))

    name = models.CharField(max_length=200)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    owner = models.CharField(max_length=50)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField()
    start_by = models.CharField(max_length=50)
    state = models.IntegerField(choices=STATE_CHOICES)
    status = models.IntegerField(choices=STATUS_CHOICES)

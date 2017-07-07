import datetime

from django.db import models
from django.utils import timezone

from .object_source import ObjectSource
from .product import Product


class TestRun(models.Model):
    STATUS_CHOICES = ((-1, 'Pending'), (0, 'Passed'), (1, 'Failed'), (2, 'Analyzed'), (3, 'Abandoned'))
    STATE_CHOICES = ((-1, 'Not Ready'), (0, 'Starting'), (1, 'Running'), (2, 'Aborted'), (3, 'Completed'))

    name = models.CharField(max_length=200)
    owner = models.CharField(max_length=50)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    start_by = models.CharField(max_length=50)
    state = models.IntegerField(choices=STATE_CHOICES, default=-1)
    status = models.IntegerField(choices=STATUS_CHOICES, default=-1)

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='runs')
    source = models.OneToOneField(ObjectSource, on_delete=models.SET_NULL, default=None, null=True)

    def team_name(self):
        return self.product.team.name

    def product_name(self):
        return self.product.name

    def result_total(self):
        return self.results.count()

    def result_passed(self):
        return self.results.filter(outcome=0).count()

    def result_failed(self):
        return self.results.filter(outcome=1).count()

    def result_skipped(self):
        return self.results.filter(outcome=2).count()

    def result_error(self):
        return self.results.filter(outcome=3).count()

    def duration(self):
        if isinstance(self.end_time, datetime.datetime):
            return str((self.end_time - self.start_time))

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return '{}'.format(self.id)

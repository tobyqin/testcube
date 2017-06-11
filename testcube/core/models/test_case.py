from django.db import models

from .product import Product
from .team import Team


class TestCase(models.Model):
    PRIORITY_CHOICES = ((0, 'Urgent'), (1, 'High'), (2, 'Medium'), (3, 'Low'))

    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    full_name = models.CharField(max_length=400, default='')
    keyword = models.CharField(max_length=100, null=True, blank=True)
    priority = models.IntegerField(default=2, choices=PRIORITY_CHOICES)
    description = models.TextField(blank=True)
    owner = models.CharField(max_length=50, blank=True)
    created_by = models.CharField(max_length=50)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.full_name if self.full_name else self.name

from django.db import models

from .team import Team


class Product(models.Model):
    name = models.CharField(max_length=200)
    version = models.CharField(max_length=20, default='latest')
    owner = models.CharField(max_length=50, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='products')

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name

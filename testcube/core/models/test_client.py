from django.db import models


class TestClient(models.Model):
    STATUS_CHOICES = ((0, 'Ready'), (1, 'Not Ready'), (2, 'Undetermined'))

    name = models.CharField(max_length=100)
    ip = models.CharField(max_length=50)
    platform = models.CharField(max_length=100)
    owner = models.CharField(max_length=50)
    status = models.IntegerField(default=0, choices=STATUS_CHOICES)
    detail = models.TextField(blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name

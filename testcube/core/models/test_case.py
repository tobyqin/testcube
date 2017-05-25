from django.db import models


class TestCase(models.Model):
    PRIORITY_CHOICES = ((0, 'Urgent'), (1, 'High'), (2, 'Medium'), (3, 'Low'))

    name = models.CharField(max_length=200)
    keyword = models.CharField(max_length=100)
    priority = models.IntegerField(default=2, choices=PRIORITY_CHOICES)
    description = models.TextField()
    owner = models.CharField(50)
    created_by = models.CharField(50)
    created_on = models.DateTimeField(auto_now_add=True)

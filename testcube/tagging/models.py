from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=20)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=50)

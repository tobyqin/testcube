from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=50)
    owner = models.CharField(max_length=50)
    created_on = models.DateTimeField(auto_now_add=True)

from django.db import models


class RunStatus(models.Model):
    name = models.CharField(max_length=50)

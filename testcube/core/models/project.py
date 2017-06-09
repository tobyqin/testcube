from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=50)
    owner = models.CharField(max_length=50, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name

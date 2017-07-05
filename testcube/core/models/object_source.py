from django.db import models


class ObjectSource(models.Model):
    link = models.CharField(max_length=1000)
    name = models.CharField(max_length=200)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return '{}'.format(self.link)

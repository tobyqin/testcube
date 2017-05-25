from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    version = models.CharField(max_length=20)
    owner = models.CharField(50)
    created_on = models.DateTimeField(auto_now_add=True)

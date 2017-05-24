from django.db import models


class Comment(models.Model):
    target_entity = models.CharField(50)
    target_id = models.IntegerField()
    content = models.TextField()
    reply_to = models.ForeignKey('self', on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=50)

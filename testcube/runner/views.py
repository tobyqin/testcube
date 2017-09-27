from rest_framework import viewsets

from .serializers import *


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    filter_fields = ('product', 'command')
    search_fields = filter_fields


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_fields = ('description', 'object_name', 'object_id', 'status', 'command')
    search_fields = filter_fields

from datetime import datetime, timezone

from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from testcube.settings import logger
from testcube.utils import append_json
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

    @list_route()
    def clear(self, request):
        """clear dead runs, will be called async when user visit run list."""
        pending_tasks = Task.objects.filter(status=-1)  # pending
        fixed = []

        for task in pending_tasks:
            delta = datetime.now(timezone.utc) - task.updated_on
            if delta.days > 1:
                logger.info('abort task: {}'.format(task.id))
                task.status = 1
                task.data = append_json(task.data, 'error', '\nTask timeout, auto clear.')
                task.save()
                fixed.append(task.id)

        return Response(data=fixed)

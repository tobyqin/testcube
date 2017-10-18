from datetime import datetime, timezone

from django.forms.models import model_to_dict
from rest_framework import viewsets
from rest_framework.decorators import list_route, detail_route
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
        """clear dead tasks, will be called async when user visit run detail page."""

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

    @list_route()
    def pending(self, request):
        """process task, GET will return top pending task"""

        pending_task = Task.objects.filter(status=-1).first()  # pending

        if pending_task:
            return Response(data=model_to_dict(pending_task))
        else:
            return Response(data={}, status=404)

    @detail_route(methods=['post'])
    def process(self, request, pk=None):
        """process task with required info."""

        instance = self.get_object()
        code = 400

        if request.method == 'POST':
            status = request.POST.get('status', 'Error')
            message = request.POST.get('message', '')

            instance.status = 0 if status == 'Sent' else 1
            instance.data = append_json(instance.data, 'message', message)
            instance.save()

            return Response(data={'status': status, 'message': message}, status=code)

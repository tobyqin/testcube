from datetime import datetime, timezone

from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from testcube.settings import logger
from .serializers import *
from ..models import *


def info_view(self, serializer_class):
    self.serializer_class = serializer_class
    instance = self.get_object()
    serializer = self.get_serializer(instance)
    return Response(serializer.data)


def list_view(self):
    self.pagination_class = LimitOffsetPagination

    queryset = self.filter_queryset(self.get_queryset())
    page = self.paginate_queryset(queryset)

    if page is not None:
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    filter_fields = ('name', 'owner')
    search_fields = filter_fields

    @list_route()
    def recent(self, request):
        """get recent teams"""
        self.queryset = Team.objects.order_by('name').all()
        self.serializer_class = TeamListSerializer
        return list_view(self)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_fields = ('name', 'owner', 'version', 'team')
    search_fields = ('name', 'owner', 'version')

    @list_route()
    def recent(self, request):
        """get recent teams"""
        self.queryset = Product.objects.order_by('name').all()
        self.serializer_class = ProductListSerializer
        return list_view(self)


class ConfigurationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
    filter_fields = ('key', 'value')
    search_fields = filter_fields


class TestClientViewSet(viewsets.ModelViewSet):
    queryset = TestClient.objects.all()
    serializer_class = TestClientSerializer
    filter_fields = ('name', 'ip', 'platform', 'owner')
    search_fields = filter_fields


class TestRunViewSet(viewsets.ModelViewSet):
    queryset = TestRun.objects.all()
    serializer_class = TestRunSerializer
    filter_fields = ('name', 'state', 'status', 'owner', 'product')
    search_fields = ('name', 'state', 'status', 'owner')

    @detail_route(methods=['get'])
    def info(self, request, pk=None):
        return info_view(self, TestRunDetailSerializer)

    @list_route()
    def recent(self, request):
        """get recent runs, in run list view"""
        self.serializer_class = TestRunListSerializer
        return list_view(self)

    @list_route()
    def clear(self, request):
        """clear dead runs, will be called async when user visit run list."""
        pending_runs = TestRun.objects.filter(state__lt=2)  # not ready, starting, running
        fixed = []

        for run in pending_runs:
            delta = datetime.now(timezone.utc) - run.start_time
            if delta.days > 1 and run.state < 2:
                logger.info('abort run: {}'.format(run.id))
                run.state, run.status = 2, 1  # abort, failed
                run.save()
                fixed.append(run.id)

        bad_runs = TestRun.objects.filter(results=None)  # run without results > 2 days
        for run in bad_runs:
            if (datetime.now(tz=timezone.utc) - run.start_time).days >= 2:
                logger.info('delete run: {}'.format(run.id))
                fixed.append(run.id)
                run.delete()

        return Response(data=fixed)

    @detail_route(methods=['get'])
    def history(self, request, pk=None):
        """get run history, will be used in run detail page."""
        instance = self.get_object()
        self.filter_fields = ()
        self.queryset = TestRun.objects.filter(name=instance.name)
        self.serializer_class = TestRunListSerializer
        return list_view(self)


class TestCaseViewSet(viewsets.ModelViewSet):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer
    filter_fields = ('name', 'full_name', 'keyword', 'priority', 'owner', 'product')
    search_fields = ('name', 'full_name', 'keyword')

    @detail_route(methods=['get'])
    def info(self, request, pk=None):
        """query result info, use for result detail page."""
        return info_view(self, TestCaseDetailSerializer)

    @list_route()
    def recent(self, request):
        """get recent testcase, use for test case page."""
        self.serializer_class = TestCaseListSerializer
        return list_view(self)

    @detail_route(methods=['get'])
    def history(self, request, pk=None):
        """get test case history, use in test case view or result detail view."""
        instance = self.get_object()
        self.filter_fields = ()
        self.queryset = TestResult.objects.filter(testcase__id=instance.id)
        self.serializer_class = TestResultHistorySerializer
        return list_view(self)


class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    filter_fields = ('outcome', 'assigned_to')
    search_fields = filter_fields

    @detail_route(methods=['get'])
    def info(self, request, pk=None):
        """query result info, use for result detail page."""
        return info_view(self, TestResultDetailSerializer)

    @list_route()
    def recent(self, request):
        """get recent runs, in run list view"""
        self.serializer_class = TestResultListSerializer

        keyword = request.GET.get('search', None)
        if keyword:
            self.queryset = TestResult.objects.filter(Q(testcase__name__icontains=keyword) |
                                                      Q(error__message__icontains=keyword))

        self.search_fields = ()
        return list_view(self)


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    filter_fields = ('name', 'summary', 'created_by', 'assigned_to', 'status')
    search_fields = filter_fields


class ResultAnalysisViewSet(viewsets.ModelViewSet):
    queryset = ResultAnalysis.objects.all()
    serializer_class = ResultAnalysisSerializer
    filter_fields = ('by', 'reason', 'description')
    search_fields = filter_fields


class ResultErrorViewSet(viewsets.ModelViewSet):
    queryset = ResultError.objects.all()
    serializer_class = ResultErrorSerializer
    filter_fields = ('exception_type', 'message', 'stacktrace', 'stdout')
    search_fields = filter_fields


class ObjectSourceViewSet(viewsets.ModelViewSet):
    queryset = ObjectSource.objects.all()
    serializer_class = ObjectSourceSerializer
    filter_fields = ()
    search_fields = filter_fields


class ResultFileViewSet(viewsets.ModelViewSet):
    queryset = ResultFile.objects.all()
    serializer_class = ResultFileSerializer
    filter_fields = ()
    search_fields = filter_fields


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 1000

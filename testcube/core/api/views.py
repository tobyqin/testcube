from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .serializers import *
from ..models import *


def info_view(self, serializer_class):
    self.serializer_class = serializer_class
    instance = self.get_object()
    serializer = self.get_serializer(instance)
    return Response(serializer.data)


def recent_view(self, model_class, serializer_class, pagination_class=None):
    recent_items = model_class.objects.all()
    self.serializer_class = serializer_class

    if pagination_class:
        self.pagination_class = pagination_class
    else:
        self.pagination_class = LargeResultsSetPagination

    page = self.paginate_queryset(recent_items)
    if page is not None:
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    serializer = self.get_serializer(recent_items, many=True)
    return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    filter_fields = ('name', 'owner')
    search_fields = filter_fields


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_fields = ('name', 'owner', 'version')
    search_fields = filter_fields


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
    filter_fields = ('name', 'state', 'status', 'owner')
    search_fields = filter_fields

    @detail_route(methods=['get'])
    def info(self, request, pk=None):
        return info_view(self, TestRunDetailSerializer)

    @list_route()
    def recent(self, request):
        return recent_view(self, TestRun, TestRunListSerializer)


class TestCaseViewSet(viewsets.ModelViewSet):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer
    filter_fields = ('name', 'keyword', 'priority', 'owner')
    search_fields = filter_fields

    @list_route()
    def recent(self, request):
        return recent_view(self, TestCase, TestCaseListSerializer)


class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    filter_fields = ('outcome', 'assigned_to')
    search_fields = filter_fields

    @detail_route(methods=['get'])
    def info(self, request, pk=None):
        return info_view(self, TestResultDetailSerializer)


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


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 5000
    page_size_query_param = 'page_size'
    max_page_size = 1000

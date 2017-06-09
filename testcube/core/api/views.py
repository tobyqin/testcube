from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .serializers import *
from ..models import *


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = TeamSerializer


class ConfigurationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer


class TestClientViewSet(viewsets.ModelViewSet):
    queryset = TestClient.objects.all()
    serializer_class = TestClientSerializer


class TestRunViewSet(viewsets.ModelViewSet):
    queryset = TestRun.objects.all()
    serializer_class = TestRunSerializer


class TestCaseViewSet(viewsets.ModelViewSet):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer


class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer


class ResultAnalysisViewSet(viewsets.ModelViewSet):
    queryset = ResultAnalysis.objects.all()
    serializer_class = ResultAnalysisSerializer

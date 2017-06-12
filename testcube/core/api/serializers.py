from rest_framework import serializers

from ..models import *


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ConfigurationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Configuration
        fields = '__all__'


class TestClientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TestClient
        fields = '__all__'


class TestRunSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TestRun
        fields = '__all__'


class TestCaseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TestCase
        fields = '__all__'


class TestResultSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TestResult
        fields = '__all__'


class IssueSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'


class ResultAnalysisSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ResultAnalysis
        fields = '__all__'


class ResultErrorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ResultError
        fields = '__all__'

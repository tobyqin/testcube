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


class TestRunListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestRun
        fields = (
            'id', 'team', 'product', 'name', 'start_time', 'end_time',
            'start_by', 'get_status_display', 'get_state_display',
            'result_total', 'result_passed', 'result_failed')

        depth = 1


class TestCaseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = (
            'id', 'team', 'product', 'name', 'full_name', 'keyword',
            'priority', 'get_priority_display', 'owner',
            'updated_on', 'created_on')

        depth = 1


class TestResultListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = (
            'id', 'run_id', 'testcase_info', 'get_outcome_display', 'duration', 'assigned_to',
            'is_rerun', 'test_client', 'created_on')

        depth = 1

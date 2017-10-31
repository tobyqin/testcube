from rest_framework import serializers

from ..models import *


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class TeamListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ('id', 'name', 'owner')


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'owner')


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


class ObjectSourceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ObjectSource
        fields = '__all__'


class ResultFileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ResultFile
        fields = '__all__'


class ResetResultSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ResetResult
        fields = '__all__'


class TestRunListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestRun
        fields = (
            'id', 'team_name', 'product_name', 'name', 'start_time', 'end_time',
            'start_by', 'get_status_display', 'get_state_display',
            'result_total', 'result_passed', 'result_failed',
            'result_skipped', 'duration')

        depth = 1


class TestCaseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = (
            'id', 'team_name', 'product_name', 'name', 'full_name',
            'keyword', 'priority', 'get_priority_display',
            'owner', 'updated_on', 'created_on', 'created_by')

        depth = 1


class TestCaseDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = (
            'id', 'team_name', 'product', 'name', 'full_name',
            'keyword', 'priority', 'get_priority_display',
            'owner', 'updated_on', 'created_on', 'created_by',
            'description', 'execution_info', 'tags_list')

        depth = 1


class TestResultListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = (
            'id', 'testcase_name', 'get_outcome_display',
            'duration', 'assigned_to', 'error_message',
            'created_on')

        depth = 1


class TestResultInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = (
            'id', 'run_info', 'testcase_info', 'get_outcome_display',
            'duration', 'assigned_to', 'test_client',
            'created_on', 'error_message', 'reason', 'stability')

        depth = 1


class TestResultHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = (
            'id', 'run_info', 'testcase_info', 'get_outcome_display',
            'duration', 'assigned_to', 'test_client',
            'created_on', 'error_message', 'reason', 'issue_id')

        depth = 1


class ResetResultDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetResult
        fields = (
            'id', 'stdout', 'get_reset_status_display', 'get_outcome_display',
            'duration', 'run_on', 'reset_on', 'reset_by',
            'test_client', 'reset_reason', 'error')

        depth = 1


class TestResultDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = (
            'id', 'test_run', 'testcase', 'testcase_exec_info',
            'get_outcome_display', 'duration', 'assigned_to',
            'test_client', 'created_on', 'stdout',
            'error', 'analysis')

        depth = 1


class TestResultFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = ('id', 'files')

        depth = 1


class TestResultResetHistorySerializer(serializers.ModelSerializer):
    reset_results = ResetResultDetailSerializer(many=True)

    class Meta:
        model = TestResult
        fields = ('id', 'reset_results')
        depth = 1


class TestRunDetailSerializer(serializers.ModelSerializer):
    results = TestResultInfoSerializer(many=True)

    class Meta:
        model = TestRun
        fields = (
            'id', 'team_name', 'product_name', 'name', 'start_time', 'end_time',
            'start_by', 'get_status_display', 'get_state_display',
            'result_total', 'result_passed', 'result_failed',
            'result_skipped', 'duration', 'results')

        depth = 1

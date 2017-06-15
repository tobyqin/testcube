from ..models import *

import rest_framework_filters as filters


class TestRunFilter(filters.FilterSet):
    class Meta:
        model = TestRun
        fields = {'id': ['exact']}


class ResultFilter(filters.FilterSet):
    run = filters.RelatedFilter(TestRunFilter, name='test_run', queryset=TestRun.objects.all())

    class Meta:
        model = TestResult
        fields = {'outcome': ['exact']}

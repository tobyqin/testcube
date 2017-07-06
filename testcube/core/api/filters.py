import rest_framework_filters as filters

from ..models import *


class TeamFilter(filters.FilterSet):
    class Meta:
        model = Team
        fields = {'id': ['exact'], 'name': ['exact'], 'owner': ['exact']}


class ProductFilter(filters.FilterSet):
    team = filters.RelatedFilter(TeamFilter, name='team', queryset=Team.objects.all())

    class Meta:
        model = Product
        fields = {'id': ['exact'], 'name': ['exact'], 'owner': ['exact']}


class TestRunFilter(filters.FilterSet):
    product = filters.RelatedFilter(ProductFilter, name='product', queryset=Product.objects.all())

    class Meta:
        model = TestRun
        fields = {'id': ['exact']}


class ResultFilter(filters.FilterSet):
    run = filters.RelatedFilter(TestRunFilter, name='test_run', queryset=TestRun.objects.all())

    class Meta:
        model = TestResult
        fields = {'outcome': ['exact']}

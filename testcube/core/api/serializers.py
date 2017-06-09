from rest_framework import serializers

from ..models import *


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ('url', 'id', 'name', 'owner', 'created_on')


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ('url', 'id', 'name', 'owner', 'created_on')


class ConfigurationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Configuration
        fields = ('url', 'id', 'key', 'value', 'created_on')


class TestRunSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TestRun
        fields = (
            'url', 'id', 'name', 'project', 'product', 'owner', 'start_time', 'end_time', 'start_by', 'state', 'status')

from rest_framework import serializers
from rest_framework import viewsets

from ..models import *


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ('url', 'id', 'name', 'owner', 'created_on')


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ('url', 'id', 'name', 'owner', 'created_on')


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProjectSerializer


class ConfigurationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Configuration
        fields = ('url', 'id', 'key', 'value', 'created_on')


class ConfigurationViewSet(viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer


class TestRunSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TestRun
        fields = (
            'url', 'id', 'name', 'project', 'product', 'owner', 'start_time', 'end_time', 'start_by', 'state', 'status')


class TestRunViewSet(viewsets.ModelViewSet):
    queryset = TestRun.objects.all()
    serializer_class = TestRunSerializer

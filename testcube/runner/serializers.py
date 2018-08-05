from rest_framework import serializers

from .models import *


class RunVariablesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = RunVariables
        fields = '__all__'

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

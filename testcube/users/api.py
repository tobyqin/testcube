from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email')


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer

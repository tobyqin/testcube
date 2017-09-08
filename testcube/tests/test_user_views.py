from django.contrib.auth.models import User
from django.test import TestCase as TC, Client


class ModelsTestCase(TC):
    def setUp(self):
        self.client = Client()
        self.admin = User.objects.create_superuser('test', 'admin@test', 'test')

    def test_user_profile_view(self):
        self.client.login(username='test', password='test')
        r = self.client.get('/profile')
        print(r.content)
        assert 'profile' in str(r.content).lower()

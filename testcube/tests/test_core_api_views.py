import json

from django.contrib.auth.models import User
from django.test import TestCase as TC, Client

from testcube.core.models import Configuration


class ModelsTestCase(TC):
    def setUp(self):
        self.client = Client()
        self.admin = User.objects.create_superuser('test', 'admin@test', 'test')
        Configuration.objects.create(key='test', value='unit')

    def test_visit_config(self):
        self.client.login(username='admin', password='admin')
        api = '/api/configurations/'

        # get the list
        r = self.client.get(api)
        result = r.json()
        print(result)
        assert result['count'] >= 1

        # insert a config
        data = {'key': 1, 'value': 1}
        r = self.client.post(api, data=data).json()
        print(r)
        assert r['key'] == '1'

        # update a config
        url = r['url']
        data = json.dumps({'key': 2, 'value': 3})
        r = self.client.put(url, data=data, content_type='application/json').json()
        print(r)
        assert r['value'] == '3'

    def test_client_auth(self):
        info = {'client_type': 'testcube_test_client',
                'client_name': 'test name',
                'client_user': 'test user',
                'platform': 'windows'}

        result = self.client.post('/client-register', data=info).json()
        print(result)

        client = result['client']
        assert 'token' in result
        assert User.objects.get(username=client) != None

        info['client_type'] = 'some bad client'
        result = self.client.post('/client-register', data=info)
        assert result.status_code != 200
        assert "Failed to register testcube" in str(result.content)

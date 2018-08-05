import json
import os

from django.contrib.auth.models import User
from django.test import TestCase as TC, Client

from testcube.core.models import Configuration, TestCase, Team, Product, TestResult, TestRun, TestClient
from testcube.runner.models import RunVariables


class ModelsTestCase(TC):
    def setUp(self):
        self.client = Client()
        self.admin = User.objects.create_superuser('test', 'admin@test', 'test')
        Configuration.objects.create(key='test', value='unit')
        self.team = Team.objects.create(name='test-team')
        self.product = Product.objects.create(name='test-product', team=self.team)
        self.testcase = TestCase.objects.create(name='testcase1', created_by='test', product=self.product)
        self.test_client = TestClient.objects.create(name='test', ip='1.1.1.1', platform='test', owner='test')

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

    def test_get_testcase_tags(self):
        self.client.login(username='admin', password='admin')
        testcase2 = TestCase.objects.create(name='testcase2', created_by='test', product=self.product)
        self.testcase.tags = 'tag1 tag2 tag3'
        testcase2.tags = 'tag3 tag4 tag5'

        api = '/api/cases/1/'
        r = self.client.get(api)
        assert r.data['name'] == 'testcase1'

        api = '/api/cases/1/tags/'
        r = self.client.get(api)
        assert r.data == ['tag1', 'tag2', 'tag3']

    def test_get_product_tags(self):
        self.client.login(username='admin', password='admin')
        testcase2 = TestCase.objects.create(name='testcase2', created_by='test', product=self.product)
        self.testcase.tags = 'tag1 tag2 tag3'
        testcase2.tags = 'tag3 tag4 tag5'

        api = '/api/products/1/'
        r = self.client.get(api)
        assert r.data['name'] == 'test-product'

        api = '/api/products/1/tags/'
        r = self.client.get(api)
        assert r.data == ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'], r.data

    def test_get_run_tags(self):
        self.client.login(username='admin', password='admin')
        testcase2 = TestCase.objects.create(name='testcase2', created_by='test', product=self.product)
        testcase3 = TestCase.objects.create(name='testcase2', created_by='test', product=self.product)

        self.testcase.tags = 'tag1 tag2 tag3'
        testcase2.tags = 'tag3 tag4 tag5'
        testcase3.tags = 'tag4 tag5'

        run = TestRun.objects.create(name='test-run', owner='test', start_by='test', product=self.product)

        for case in [self.testcase, testcase2, testcase3]:
            TestResult.objects.create(outcome=1,
                                      assigned_to='test',
                                      test_run=run,
                                      testcase=case,
                                      test_client=self.test_client)

        api = '/api/runs/1/'
        r = self.client.get(api)
        assert r.data['name'] == 'test-run'

        api = '/api/runs/1/tags/'
        r = self.client.get(api)
        expected = [('tag3', 2), ('tag4', 2), ('tag5', 2), ('tag1', 1), ('tag2', 1)]
        assert r.data == expected, r.data

    def test_use_run_variables(self):
        self.client.login(username='admin', password='admin')
        run = TestRun.objects.create(name='test-run', owner='test', start_by='test', product=self.product)
        env_vars = json.dumps(dict(os.environ))
        var = RunVariables.objects.create(test_run=run, data=env_vars)
        assert var.data == env_vars
        assert isinstance(var.data_json, dict)

from django.test import TestCase as TC, Client


class ModelsTestCase(TC):
    def setUp(self):
        self.client = Client()

    def test_visit_welcome(self):
        r = self.client.get('/welcome')
        assert 'welcome' in str(r.content).lower()

    def test_visit_faq(self):
        r = self.client.get('/docs/faq')
        assert r.status_code == 200
        assert 'what' in str(r.content).lower()

    def test_sign_in(self):
        r = self.client.get('/signin')
        assert r.status_code == 200

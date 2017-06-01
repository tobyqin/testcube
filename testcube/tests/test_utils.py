from django.test import TestCase as TC

from testcube.utils import *


class ModelsTestCase(TC):
    def setUp(self):
        pass

    def test_get_domain(self):
        assert get_domain() == 'company.com'
        Configuration.objects.create(key='domain', value='my.com')
        assert get_domain() == 'my.com'

    def test_read_document(self):
        content = read_document('faq')
        assert 'what' in content.lower()

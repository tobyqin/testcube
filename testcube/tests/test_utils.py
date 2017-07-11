from django.test import TestCase as TC

from testcube.core.models import *
from testcube.utils import *


class ModelsTestCase(TC):
    def setUp(self):
        pass

    def test_get_domain(self):
        assert get_domain() == 'company.com'
        config = Configuration.objects.get(key='domain')
        config.value = 'my.com'
        config.save()
        assert get_domain() == 'my.com'

    def test_read_document(self):
        content = read_document('faq')
        assert 'what' in content.lower()

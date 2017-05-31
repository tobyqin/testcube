from os.path import join

from .core.models import Configuration
from .settings import SETTINGS_DIR


def get_domain():
    return Configuration.get('domain', 'company.com')


def read_document(name):
    doc_path = join(SETTINGS_DIR, 'static/docs', name + '.md')
    with open(doc_path) as f:
        return f.read()

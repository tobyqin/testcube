from .core.models import Configuration


def get_domain():
    return Configuration.get('domain', 'company.com')

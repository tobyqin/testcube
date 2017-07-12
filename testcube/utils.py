import logging
import sys
from logging.handlers import RotatingFileHandler
from os.path import join


def get_domain():
    from .core.models import Configuration
    return Configuration.get('domain', 'company.com')


def get_menu_links():
    from .core.models import Configuration
    return [link for link in Configuration.menu_links()]


def read_document(name):
    from .settings import SETTINGS_DIR
    doc_path = join(SETTINGS_DIR, 'static/docs', name + '.md')
    with open(doc_path) as f:
        return f.read()


def setup_logger(log_dir=None, debug=False):
    logger = logging.getLogger('testcube')
    formatter = logging.Formatter('%(asctime)s %(levelname)-8s: %(message)s')

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.formatter = formatter
    logger.addHandler(console_handler)

    if log_dir:
        filename = join(log_dir, 'testcube.log')
        if debug:  # use single file when debug
            file_handler = logging.FileHandler(filename)
            file_handler.setFormatter(formatter)

        else:
            file_handler = RotatingFileHandler(filename=filename,
                                               maxBytes=10 * 1024 * 1024,
                                               backupCount=5)
        logger.addHandler(file_handler)

    if debug:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)

    return logger

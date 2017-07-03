"""
use this script to start a new testcube
warning: will re-create database
"""

import os
from os import environ, chdir, remove, listdir
from os.path import dirname, exists, join, isfile, abspath

project_root = abspath(dirname(dirname(__file__)))
db_file = environ.get('TESTCUBE_DB_NAME') or 'db.sqlite3'
migrate_dirs = [join(project_root, 'testcube/core/migrations')]

print('Project root:' + project_root)
chdir(project_root)

print('1. delete db: {}'.format(db_file))
if exists(db_file):
    remove(db_file)
else:
    print('not found.')

print('\n2. delete the migrate files')
migrate_dirs = [d for d in migrate_dirs if exists(d)]
for d in migrate_dirs:
    files = [join(d, f) for f in listdir(d) if f != '__init__.py']
    files = [f for f in files if isfile(f)]
    for f in files:
        print('delete: {}'.format(join(d, f)))
        remove(f)

print('\n3. make migrations')
os.system('python manage.py makemigrations')

print('\n4. migrate')
os.system('python manage.py migrate')

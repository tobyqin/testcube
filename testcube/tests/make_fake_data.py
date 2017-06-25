import os
import sys
from datetime import timedelta
from os.path import dirname

import django
from django.utils import timezone
from faker import Faker

project_dir = dirname(dirname(dirname(__file__)))
sys.path.append(project_dir)
os.chdir(project_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = 'testcube.settings'

django.setup()

from testcube.core.models import *

fake = Faker()

team_list = ['core', 'develop', 'support', 'school', 'power']

product_list = ['Lollipop', 'wafer', 'Gummies',
                'sesame', 'Jelly', 'beans']

run_types = ['nightly', 'smoke', 'weekly', 'ad-hoc']
environments = ['QA', 'UAT']
testcase_word = ['information', 'available', 'copyright', 'university', 'management',
                 'international', 'development', 'education', 'community', 'technology', 'following',
                 'resources', 'including', 'directory', 'government', 'department', 'description',
                 'insurance', 'different', 'categories', 'conditions', 'accessories', 'september', 'questions',
                 'application', 'financial', 'equipment', 'performance', 'experience', 'important']

client_names = ['local', 'dev-01', 'qa-01', 'pc-home']
exc_types = ['AssertError', 'ValueError', 'SystemError']


def get_one_client():
    name = fake.random.choice(client_names)
    return TestClient.objects.get_or_create(name=name, defaults={
        'ip': '168.1.1.{}'.format(fake.random.randint(2, 255)),
        'platform': fake.word,
        'owner': fake.name
    })[0]


def get_one_team():
    team = fake.random.choice(team_list).capitalize()
    return Team.objects.get_or_create(name=team, defaults={'owner': fake.name()})[0]


def get_one_product():
    product = fake.random.choice(product_list).capitalize()
    return Product.objects.get_or_create(name=product, defaults={'owner': fake.name()})[0]


def get_run_name(product_name):
    t = fake.random.choice(run_types)
    e = fake.random.choice(environments)
    return "{} {} run on {}".format(product_name, t, e)


def get_tc_name(product_name):
    if fake.boolean(chance_of_getting_true=50):
        w = fake.word()
    else:
        w = fake.random.choice(testcase_word)

    return 'test {} {}'.format(product_name, w)


def get_or_create_tc(team, product):
    name = get_tc_name(product.name)
    return TestCase.objects.get_or_create(name=name,
                                          defaults={'team': team,
                                                    'product': product,
                                                    'owner': product.owner})[0]


def start_run(team, product):
    name = get_run_name(product.name)
    start_time = fake.date_time_between(start_date="-1y", end_date="-7d", tzinfo=timezone.get_current_timezone())
    return TestRun.objects.create(team=team, product=product, name=name,
                                  owner=product.owner, start_time=start_time,
                                  start_by=team.owner)


def finish_run(run, status='Failed'):
    status_code = 0 if status == 'Passed' else 1
    run.state = 3
    run.status = status_code
    run.save()


def create_passed_result(run):
    args = {
        'test_run': run,
        'testcase': get_or_create_tc(run.team, run.product),
        'outcome': 0,
        'stdout': '\n'.join(fake.sentences(10)),
        'duration': timedelta(seconds=fake.random.randint(50, 200)),
        'assigned_to': run.product.owner,
        'test_client': get_one_client()}
    return TestResult.objects.create(**args)


def create_result_error():
    exc = fake.random.choice(exc_types)
    args = {
        'exception_type': exc,
        'message': '{}: {}'.format(exc, fake.text(80)),
        'stacktrace': '\n'.join(fake.sentences(10))
    }
    return ResultError.objects.create(**args)


def create_failed_result(run):
    args = {
        'test_run': run,
        'testcase': get_or_create_tc(run.team, run.product),
        'outcome': 1,
        'error': create_result_error(),
        'stdout': '\n'.join(fake.sentences(10)),
        'duration': timedelta(seconds=fake.random.randint(50, 200)),
        'assigned_to': run.product.owner,
        'test_client': get_one_client()}
    return TestResult.objects.create(**args)


def generate_passed_run():
    product = get_one_product()
    team = get_one_team()
    run = start_run(team, product)
    for i in range(fake.random.randint(80, 100)):
        create_passed_result(run)

    finish_run(run, status='Passed')


def generate_failed_run():
    product = get_one_product()
    team = get_one_team()
    run = start_run(team, product)
    for i in range(fake.random.randint(90, 100)):
        if fake.boolean(70):
            create_passed_result(run)
        else:
            create_failed_result(run)

    finish_run(run, status='Failed')


def main():
    for i in range(100):
        if fake.boolean(70):
            generate_failed_run()
        else:
            generate_passed_run()


if __name__ == '__main__':
    main()

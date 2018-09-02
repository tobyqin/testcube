"""
Examples to use client api.
"""
from json import dumps
from os import environ

import requests

server = 'http://127.0.0.1:8000/'
root = server + 'api/'

# call client api requires valid user, you can register at first
auth = ('admin', 'admin')


def test_register_client():
    """use this api to register as a testcube client, it will return a name and token."""
    api = 'client-register/'

    data = {
        'client_type': 'testcube_pytest_client',  # must in this format 'testcube_xxx_client'
        'client_name': 'test_client',  # special chars and space are not allowed
        'client_user': 'test',
        'platform': 'windows'
    }

    response = requests.post(url=server + api, data=data)
    result = response.json()
    print(result)

    assert 'client' in result
    assert 'token' in result


def test_start_run():
    """use this api to start a run, will return run info if success."""
    api = 'runs/start/'

    data = {
        'name': 'my test run',
        'product': {
            'name': 'TestCube',
            'team': {
                'name': 'ATeam'
            }
        },
        # optional, if provided will be a link in run page
        'source': {
            'name': 'Jenkins',
            'link': 'http://jenkins/run'
        },
        # optional, run variables can be saved to reset purpose
        'variables': dumps(dict(environ)),
    }

    response = requests.post(url=root + api,
                             auth=auth,
                             json=data)

    result = response.json()
    assert result['success'], response.text
    run = result['run']
    print(run)


def test_stop_run():
    """call this api to update run status & state once run finished."""
    api = 'runs/stop/'

    data = {
        'run_id': 13,
        'state': 3,  # default 3=>completed, (2=aborted)
        'status': 1,  # default 1=>failed, (0=passed, 3=abandoned)
    }

    response = requests.post(url=root + api,
                             auth=auth,
                             json=data)

    result = response.json()
    assert result['success'], response.text
    run = result['run']
    print(run)


def test_add_test_result():
    """use this api to create a test result for a run."""
    api = 'results/new/'

    data = {
        'run_id': 13,
        'outcome': 1,  # 0=passed, 1=failed, 2=skipped, 3=error, 5=pending'
        'stdout': 'my test output',
        'duration': 23.5,  # float, in seconds
        'testcase': {
            'name': 'VerifyLoginFailed',
            'full_name': 'tests.login_tests.VerifyLoginFailed',
            'description': 'ECS-1234, optional',
        },
        'test_client': {
            'name': 'test-agent1',
            'platform': 'windows 10.1',
        },
        'error': {
            'exception_type': 'AssertError',
            'message': 'the message of exception',
            'stacktrace': 'the stack trace info',
        }
    }

    response = requests.post(url=root + api,
                             auth=auth,
                             json=data)

    result = response.json()
    assert result['success'], response.text
    test_result = result['result']
    print(test_result)


def test_add_result_file():
    """
    use this api to add a result file to a run.
    to link result file to result, the file name should contains testcase name.
    e.g. test1.png will link to result of test1 in the run.
    """
    api = 'result_files/new/'

    data = {'run_id': 13, 'case_full_name': 'tests.login.test1'}
    files = {'file': open('./data/test1.png', 'rb')}
    response = requests.post(url=root + api,
                             auth=auth,
                             data=data,
                             files=files)

    result = response.json()
    assert result['success'], response.text
    result_file = result['file']
    print(result_file)

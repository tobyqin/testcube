"""
Examples to use client api.
"""
import requests

server = 'http://localhost:8000/'
root = server + 'api/'
auth = ('admin', 'admin')


def test_register_client():
    api = 'client-register/'

    data = {
        'client_type': 'testcube_pytest_client',
        'client_name': 'test_client',
        'client_user': 'test',
        'platform': 'windows'
    }

    response = requests.post(url=server + api, data=data)
    result = response.json()
    print(result)

    assert 'client' in result
    assert 'token' in result


def test_start_run():
    api = 'runs/start/'

    data = {
        'name': 'my test run',
        'product': {
            'name': 'TestCube',
            'team': {
                'name': 'ATeam'
            }
        },
        'source': {
            'name': 'Jenkins',
            'link': 'http://jenkins/run'
        }}

    response = requests.post(url=root + api,
                             auth=auth,
                             json=data)

    result = response.json()
    assert result['success'], response.text
    run = result['run']
    print(run)


def test_stop_run():
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
    api = 'result_files/new/'

    data = {'run_id': 13}
    files = {'file': open('./data/test1.png', 'rb')}
    response = requests.post(url=root + api,
                             auth=auth,
                             data=data,
                             files=files)

    result = response.json()
    assert result['success'], response.text
    result_file = result['result']
    print(result_file)

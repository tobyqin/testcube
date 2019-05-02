[![Build Status](https://img.shields.io/travis/tobyqin/testcube.svg)](https://travis-ci.org/tobyqin/testcube) 
[![codecov](https://codecov.io/gh/tobyqin/testcube/branch/master/graph/badge.svg)](https://codecov.io/gh/tobyqin/testcube)
[![GitHub tag](https://img.shields.io/github/tag/tobyqin/testcube.svg)](https://github.com/tobyqin/testcube/releases) 
![Python Version](https://img.shields.io/badge/python-3.5-green.svg)

## TestCube

![testcube overview](docs/images/testcube-life-cycle.png)

TestCube is a platform to manage and monitor automation test run and results, it provides a friendly web interface which is build with Python and Django.

Let me take 1 minute to describe TestCube...

**Why ?** - To manage and analyze automation test results efficiently.

**What ?** - It is web portal to deal with stuff like test runs, test cases, test results and test reports.

**How ?** - Your automation tests should generate [xunit](http://reflex.gforge.inria.fr/xunit.html#xunitReport) or 
[junit](http://llg.cubic.org/docs/junit/) xml files, then TestCube will provide client or API to let you upload such xml files.

So you have to learn about its client or API later.


## Features

### 1. Manage test run in one page

![testcube runs](docs/images/testcube-view-runs.png)


### 2. Analyze and view test reports

![testcube report](docs/images/testcube-view-run-detail.png)

### 3. Tag test case and show coverage

![testcube tags](docs/images/testcube-view-testcase-detail.png)

![testcube coveage](docs/images/testcube-view-run-coverage.png)

### 4. Analyze test result in a nice way

![testcube result](docs/images/testcube-view-result-detail.png)

![testcube result](docs/images/testcube-view-result-log.png)

![testcube result](docs/images/testcube-view-result-reason.png)

![testcube reset result](docs/images/testcube-view-result-reset.png)

For more features, please refer to issues page or todo list.
 
## Get Started

Basically, there are 3 steps to run TestCube:

1. Deploy a TestCube server.
2. Install TestCube client to upload test results files. (*.xml)
3. Review and analyze results from TestCube website.

TestCube is built on Python, but it does not limit clients and users are Python-based.

### Project Links

- TestCube Server: https://github.com/tobyqin/testcube
- TestCube Python Client: https://github.com/tobyqin/testcube-client

## Deployment

I assume you have basic knowledge with Python and Django, or it is not easy to help you on the way.

### 1. Fetch the code
Clone or download this repo into your local workspace.
```
git clone https://github.com/tobyqin/testcube.git
```

### 2. Update settings based on your demands
Before getting started, you should review and update `/testcube/settings.py` to meet your needs. 
You might want to update: `SECRET_KEY`, `ALLOWED_HOSTS`, `DATABASES`, `STATIC_ROOT` and more.

### 3. Follow setup steps

To start a Django website, you have to do things like below:

- Install requirements.
- Create database scheme.
- Load default data. (optional)
- Create super user. (to administrate the website)
- Collect static files. (required for production deployment, skip it during development)
- Start the web server.

To accomplish above steps, open a command window and follow me:

```shell
# supposed you have python3 installed and added in PATH

cd /path/to/testcube

# step 0. Create virtual environment for this app
# https://virtualenv.pypa.io/en/stable/userguide/

# step 1. Install requirements
pip install -r requirements.txt

# step 2. Create database (will create a default super user: admin/admin)
python manage.py migrate

# step 3. create super user (optional, see step 2)
python manage.py createsuperuser

# step 4. collect static files (optional, for deployment)
python manage.py collectstatic

# step 5. start the web server (for site preview or development)
python manage.py runserver
```

Once the server started, you should be able to visit TestCube at http://127.0.0.1:8000/. 

### 4. Production Deployment

Basically, you can follow steps in `/scripts/` folders to deploy TestCube, for more detail, 
please refer to [Django official deployment documents](https://docs.djangoproject.com/en/1.11/howto/deployment/).

On target server, A best practice is setting environment variables as [example](/env.example).

## Join Development

This project is still under development, welcome to fork and send pull request.

### Install Dev requirements

Install additional dependencies to setup dev environment.
```
pip install -r requirements-dev.txt
```

### Unit tests

Before send pull requests, please add relevant unit tests and make them passed.

```
python manage.py test
```

### Test coverage

To check your test coverage, and generate an HTML coverage report, please run:
```
coverage run manage.py test
coverage html
open htmlcov/index.html
```

## Deployment with Docker

To simply start testcube with docker, do it like this:

```shell
cd path/to/testcube
docker build -t testcube .
docker -d -p=4000:4000 testcube
# now visit testcube at http://localhost:4000
```

### Run docker-compose

It works with Postgresql and Nginx on port 4000, if the port is allocated or you want to use different database, 
update the docker-compose.yml. 

Note: you should update settings & related environment variables at first!

```shell
cd path/to/testcube
docker-compose up
```

## FAQ

More questions about TestCube will be answered at  [FAQ](/testcube/static/docs/faq.md). 
You can find an xmind file in `/docs` folder, that is the original design and prototype.

## License

MIT

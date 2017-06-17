[![Build Status](https://img.shields.io/travis/tobyqin/testcube.svg)](https://travis-ci.org/tobyqin/testcube) 
[![codecov](https://codecov.io/gh/tobyqin/testcube/branch/master/graph/badge.svg)](https://codecov.io/gh/tobyqin/testcube)
[![Code Climate](https://img.shields.io/codeclimate/github/tobyqin/testcube.svg)](https://codeclimate.com/github/tobyqin/testcube)
[![GitHub tag](https://img.shields.io/github/tag/tobyqin/testcube.svg)](https://github.com/tobyqin/testcube/releases) 
![Python Version](https://img.shields.io/badge/python-3.5-green.svg)

## TestCube

TestCube is a platform to manage and monitor automation test results, it provides a friendly web interface which is build with Python and Django.

Let me use 1 minute to describe TestCube...

**Why ?** - To manage and analyze automation test results efficiently.

**What ?** - It is web portal to deal with stuff like test runs, test cases, test results and test reports.

**How ?** - Your automation tests must generate [xunit](http://reflex.gforge.inria.fr/xunit.html#xunitReport)  
or [junit](http://llg.cubic.org/docs/junit/) xmls, TestCube will provide client or API to let you upload such xml files.

So you have to learn about its API and client before using it.


## Get Started

General to say, there are 3 steps to use TestCube:

1. Deploy a TestCube server
2. Install TestCube client to upload test results files (*.xml)
3. View and analyze runs from TestCube dashboard

TestCube is built on Python, but do not limit clients and users are Python must.

### Project Links

- TestCube Server: https://github.com/tobyqin/testcube
- TestCube Python Client: https://github.com/tobyqin/testcube-client

## Deployment

I assume you have basic knowledge with python and Django, or it will be hard to help you on the way.

### 1. Fetch the code
Clone or download this repo into your local workspace.
```
git clone https://github.com/tobyqin/testcube.git
```

### 2. Review and update settings
Before getting started, you should review and update `/testcube/settings.py` to meet your needs. You might want to update: `SECRET_KEY`, `ALLOWED_HOSTS`, `DATABASES`, `STATIC_ROOT` and more.

### 3. Basic setup commands

To start a Django website, you have to do  things like below:
- Install requirements
- Create database scheme
- Load default data (optional)
- Create super user (to administrate the website)
- Collect static files (only required for deployment, skip it during development)
- Start the web server

To accomplish above steps, open a command window and follow me:

```shell
# supposed you have python3 installed and added in PATH

cd /path/to/testcube

# step 0. Create virtual environment for this app
# https://virtualenv.pypa.io/en/stable/userguide/

# step 1. Install requirements
pip install -r requriements.txt

# step 2. Create database
python manage.py migrate

# step 3. Load default data (optional)
python manage.py loaddata configuration

# step 4. create super user
python manage.py createsuperuser

# step 5. collect static files (optional, for deployment)
python manage.py collectstatic

# step 6. start the web server (for site preview and development)
python manage.py runserver
```

Once the server started, you should be able to visit TestCube at http://127.0.0.1:8000/. 

### 4. More

Basically, you can follow steps in `/scripts/` folders to deploy TestCube, for more detail, 
please refer to [Django official deployment documents](https://docs.djangoproject.com/en/1.11/howto/deployment/).

On target server, A best practice is setting environment variables as [example](/env.example).

## Join Development

This project is still under development, welcome to fork and send pull request.

### Unit tests

Before send pull requests, please add relevent unit tests and make them passed.

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

## FAQ

More questions about TestCube will be answered at  [FAQ](/testcube/static/docs/faq.md). 
You can find an xmind file in `/docs` folder, that is the original design and prototype.

## License

MIT

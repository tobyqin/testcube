[![Build Status](https://img.shields.io/travis/tobyqin/testcube.svg)](https://travis-ci.org/tobyqin/testcube) 
[![Code Climate](https://img.shields.io/codeclimate/github/tobyqin/xmind2testlink.svg)](https://codeclimate.com/github/tobyqin/xmind2testlink)
[![GitHub tag](https://img.shields.io/github/tag/tobyqin/testcube.svg)](https://github.com/tobyqin/testcube/releases) 
![Python Version](https://img.shields.io/badge/python-3.5-green.svg)

## TestCube

Testcube is a platform to manage and monitor automation test results, it provides a friendly web portal which is build with python + django.

You also need to learn about its API and client before using it.

## Get Started

I assume you have basic knowledage with python and django, or it will be hard to help you on the way.

### 1. Fetch the code
Clone or download the repo into your local workspace.
```
git clone https://github.com/tobyqin/testcube.git
```

### 2. Review and update settings
Before getting started, you should review and update `/testcube/settings.py` to meet your needs. You might want to update: `SECRET_KEY`,`ALLOWED_HOSTS`,`DATABASES`,`STATIC_ROOT` and more.

### 3. Basic setup commands

To start a django website, you at least have to do  things like:


* To create a **normal user account**, just go to Sign Up and fill out the form. Once you submit it, you'll see a "Verify Your E-mail Address" page. Go to your console to see a simulated email verification message. Copy the link into your browser. Now the user's email should be verified and ready to go.

* To create an **superuser account**, use this command::
```
$ python manage.py createsuperuser
```
For convenience, you can keep your normal user logged in on Chrome and your superuser logged in on Firefox (or similar), so that you can see how the site behaves for both kinds of users.

Test coverage

To run the tests, check your test coverage, and generate an HTML coverage report::
```
$ coverage run manage.py test
$ coverage html
$ open htmlcov/index.html
```
Running tests with py.test
```
$ py.test
```

## FAQ

More questions about TestCube will be answered at  [FAQ](/testcube/static/docs/faq.md).

## Deployment

Basically, you can follow steps in `/scripts/` folders to deploy TestCube, for more detail, please refer to [Django offical deployment document](https://docs.djangoproject.com/en/1.11/howto/deployment/).

## License
MIT
[![Build Status](https://img.shields.io/travis/tobyqin/testcube.svg)](https://travis-ci.org/tobyqin/testcube) 
[![Code Climate](https://img.shields.io/codeclimate/github/tobyqin/xmind2testlink.svg)](https://codeclimate.com/github/tobyqin/xmind2testlink)
[![GitHub tag](https://img.shields.io/github/tag/tobyqin/testcube.svg)](https://github.com/tobyqin/testcube/releases) 
![Python Version](https://img.shields.io/badge/python-3.5-green.svg)

## TestCube

Testcube is a platform to manage and monitor automation test results, it is a web portal provides variables clients + API to let you talk to it.

License: **MIT**

## Settings

Todo

## Basic Commands

Setting Up Your Users

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


## Deployment
The following details how to deploy this application.
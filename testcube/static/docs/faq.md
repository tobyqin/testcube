## What is TestCube ?

TestCube is a platform to manage and monitor automation test results, it provides a friendly web interface which is build with Python and Django. 

> Project: https://github.com/tobyqin/testcube

![TestCube](https://raw.githubusercontent.com/tobyqin/testcube/master/testcube/static/images/testcube-overview.png)

## Should I use TestCube, how can it help me?

This is an open-source project, and I am not a marketing guy try to sell this product to you. However, as a testing engineer, to be frank, you might feel paint when you manage hundreds of test runs, test cases or test results in a day.

There might be such a tool in your hand/company to manage test runs, if you are satisfied with it, cherish it.

If no, welcome to try TestCube. It will provide modern interface to help you manage test runs, manage test cases, analyze test results, link issues, send reports and do more. 

Welcome to [submit issues](https://github.com/tobyqin/testcube/issues) or send [pull requests](https://github.com/tobyqin/testcube/pulls) for new features.

## How to use TestCube?

Basically, there are 3 steps to use TestCube:

1. Deploy a TestCube server.
2. Install TestCube client to upload test results files. (*.xml)
3. View and analyze runs from TestCube portal.

TestCube is built on Python, but it does not limit users are must on Python. If you can see this page, that means you have already finished the first step. So next step is:

### 1. Generate XUnit Results

Your automation tests should meet one requirement:

- It can generate **xunit**  or **junit** test results.

**xunit** report is a standard output of unit tests, it can be produced by almost all kinds of test frameworks, also it can be easily imported into varies of tool, for example: Jenkins, TeamCity etc.

So you probably don't have to change anything in your current automatons, I guess right? 

### 2. Upload results via TestCube Client

To talk to TestCube server, you should have [TestCube client](https://github.com/tobyqin/testcube-client) installed.

```
pip install testcube-client -U
```

Then register the client to your server:

```
testcube-client --register http://server:8000
```

Finally, choose a strategy to upload results.

#### 2.1 Upload results to TestCube once test finished

```
# put this command at the end of a run
testcube-client --run -n "smoke tests for testcube" -t XPower -p TestCube -x **/smoke*.xml
```

#### 2.2 OR: Start and finish a run separately

Put this command before run started:

```
testcube-client --start-run -name "nightly run for testcube"  --team Core --product TestCube
```

Put this after run finished:

```
 testcube-client --finish-run --xunit-files **/results/*.xml
```

The difference between strategy 2.1 and 2.2 is the exact run start time, with strategy 2.1 TestCube will guess run start time according to run duration.

### 3. Review Reports and Analyze Test Run

Once results had been uploaded, you should be able to view test reports from TestCube home page.


## How to setup TestCube client on Jenkins?

Strategy 2.1, you just have to add bellow commands at the end of a run.

```
pip install testcube-client -U
testcube-client --register http://server:8000
testcube-client --run -t TeamName -p ProductName -x "**/results/*.xml"

# upload result files (e.g. your tests will generate screen shots)
testcube-client --result-files "**/*.png"
```

Strategy 2.2, add start command as run first step.

```
pip install testcube-client -U
testcube-client --register http://server:8000
testcube-client --start-run -t TeamName -p ProductName
```

Then add finish command to run last step.

```
testcube-client --finish-run -x "**/results/*.xml" -i "**/*.png"
```

## Advanced Topics

For advanced features, the best way to ping me or find out via source code.

### 1. Reset a test result

TestCube provide the feature to reset a failed test result, there are lots of reason when a test failed, sometimes you want to run the failed test again, **reset** means rerun a failed test.

From test result detail page, you can see a reset tab provide reset feature, before it works, you have to do a few works:

A. Setup a job to process reset work
  - This job requires variables so your test engine can run the failed test case and generate xunit files, e.g. testcase name, environments, result id
  - Upload the xunits by command: `testcube-client --reset-result 123 -x "**/*.xml"`
  - Additionally, you could upload screenshots as well: `testcube-client -i "**/*.png"`

B. Add a reset profile for target product
  - Open /api/profiles/ to add a profile to your product, with step A command
  - replace the required variables with context object, for example:
    + `http://jenkins/jobs/reset-testcube?/buildWithParameters?test={result.testcase.name}&ResetId={reset.id}&ENV={ENV}`
  - You can use `result`, `reset` and all environment variables for original run in reset command. 

C. Setup a job to handle reset tasks automatically, e.g. running every 5 minutes
  - command: `testcube-client --handle-task`

D. Reset a failed result in detail page
  - After above steps done, when you reset a failed reset, TestCube will
    + Generate a reset task
    + Job C will handle the task and process reset command
    + Reset command will trigger job A
    + Once job A done, it will update target result and reset history

### 2. Configurations

By default, when you deploy TestCube there will be default administrator (admin/admin). you can login to admin panel from below address:

- [http://your-site-domain/admin](/admin)

From there you can add/delete/update quite a lot models, for example:

- Groups / Users
- Configrations / Products / Teams / Test Cases / Test Runs

I put most system configurations in `Configurations` model, in this model, you will be able to update: 

- domain (used to signup a new user)
- menu link (yes, the main top menu items)
- auto_cleanup_run_after_days (days to keep the runs results , 0 means forever)

When deploy TestCube, you can configurate a few more things via environment variable, for more detail, please check `env.example` in source folder. 

### 3. Clean up old runs

When TestCube run days after days, there might be a lot of data, a smart way is clean up old runs after specified days. You can do this by TestCube client.

```
testcube-client --cleanup-runs --days 90
```

With above command run results 90 ago will be cleaned up, including result files, which will save space and speed up TestCube loading a page.
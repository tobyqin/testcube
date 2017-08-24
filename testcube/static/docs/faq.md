## What is TestCube ?

TestCube is a platform to manage and monitor automation test results, it provides a friendly web interface which is build with Python and Django. Project at https://github.com/tobyqin/testcube.

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
```

Strategy 2.2, add start command as run first step.

```
pip install testcube-client -U
testcube-client --register http://server:8000
testcube-client --start-run -t TeamName -p ProductName
```

Then add finish command to run last step.

```
testcube-client --finish-run -x "**/results/*.xml"
```

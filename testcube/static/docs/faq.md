## What is TestCube ?

TestCube is a platform to manage and monitor automation test results, it is a web portal provides client + API to let you talk to it. Backend is on Django + Python, project page: https://github.com/tobyqin/testcube.

## Should I use TestCube, how can it help me?

This is an open-source project, and I am not a marketing guy try to sell this product to you. However, as a testing engineer, to be frank, you might feel paint like me when you manage hundreds of test runs, test cases or test results in a day.

There might be such a tool in your hand/company to manage test runs, if you are satisfied with it, cherish it.

If no, welcome to have a try. TestCube will provide modern interface to help you manage test runs, manage test cases, analyze test results, link issue, send reports. 

If it still cannot meet your need, welcome to [submit issues](https://github.com/tobyqin/testcube/issues) or send [pull requests](https://github.com/tobyqin/testcube/pulls).

## How to use TestCube?

### 1. Generate XUnit Results

To get started with TestCube, your automation tests should at least meet one requirement:

- Must generate **xunit** test results.
- Xunit report reference: http://reflex.gforge.inria.fr/xunit.html#xunitReport

**xunit** is a standard output of unit tests, it can be produced by almost all kinds of test frameworks, also  it can be easily imported by varies of tool, for example: Jenkins, TeamCity etc.

So you probably don't have to change anything in your current test project, just add arguments to generate **xunit** results. 

### 2. Upload via TestCube Client

To talk to TestCube server, you should have TestCube client installed.

> pip install testcube-client

Then you can choose any strategy to talk to TestCube.

#### 2.1 Upload xunit result to TestCube once test finished.

> testcube-client --xunit "/path/to/xunit*.xml --server "http://server:port"

#### 2.2 Create and complete run separately.

Before run started

> testcube-client --start_run --run_name "Run Name" --tags "smoke,core"

After run finished

> testcube-client --finish_run --run_id 123 --xunit "/path/to/*.xml"

### 3. Review Reports and Analyze Test Run

Once results had been uploaded, you should be able to view test reports from home page.


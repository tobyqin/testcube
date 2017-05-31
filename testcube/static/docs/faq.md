## What is TestCube ?

TestCube is a platform to manage and monitor automation test results, it is a web portal provides variables clients + API to let you talk to it.

Build on Django + Python, you can find its project page at: https://github.com/tobyqin/testcube.

## Should I use this tool, how can it help me?

This is an open-source project, and I am not a marketing guy try to sell this product to you. However, as a senior testing engineer, to be frank, you might feel paint like me when you have to manage hundreds of test runs, test cases or test results in a day.

There might be such a tool in your hand/company to manage test runs, if you are satisfied with it, forget me.

If you are looking for such a tool, here it is. TestCube will help you monitor test runs, provide modern interface to analyze test results, link issue, send reports. 

If it still cannot meet your need, welcome to [submit issues](https://github.com/tobyqin/testcube/issues) or send [pull requests](https://github.com/tobyqin/testcube/pulls).

## How to use TestCube?

To get started with TestCube, your automation tests should at least meet one requirement:

- Must generate `xunit` test results.
- Xunit report reference: http://reflex.gforge.inria.fr/xunit.html#xunitReport

`xunit` is like a standard output of unit tests, it can be produced by almost all kinds of test frameworks, also  it can be easily imported by varies of tool, for example: Jenkins, TeamCity etc.

### TestCube Python Client

To talk to TestCube server, you should have client installed.

```Shell
pip install testcube-client
```

Then you can choose any strategy to talk to TestCube.

1. Upload xunit result to TestCube once test finished.
   1. `testcube-client --xunit "/path/to/xunit*.xml --server "http://server:port"`
2. Create and complete run separately.
   1. `testcube-client --start_run --run_name "Run Name" --tags "smoke,core"`
   2. `testcube-client --finish_run --run_id 123 --xunit "/path/to/*.xml"`


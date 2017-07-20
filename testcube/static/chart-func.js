define(['moment', 'c3', 'd3', 'common'], function (moment, c3, d3, common) {

    "use strict";
    let config = {};

    config.successColor = 'rgb(44, 160, 44)';
    config.failedColor = 'rgb(214, 39, 40)';
    config.warnColor = 'rgb(255, 127, 14)';
    config.infoColor = 'rgb(31, 119, 180)';

    function runDetailChartRender() {
        if (window.app.runList === undefined || window.app.summaryInfo === undefined) return;
        if (window.app.summaryInfo.result_total === 0) return;

        let x = ['x'];
        let runIds = [];
        let passed = ['Passed'];
        let failed = ['Failed'];
        let skipped = ['Other'];
        let total = ['Total'];
        let passRate = ['PassRate'];

        // get last 10 will be okay
        let latest = window.app.runList.results.slice(0, 9);
        for (let run of latest.reverse()) {
            runIds.push('Run: ' + run.id);
            x.push(moment(run.start_time).format('YYYY-MM-DD'));
            passed.push(run.result_passed);
            failed.push(run.result_failed);
            skipped.push(run.result_skipped);
            total.push(run.result_total);
            passRate.push(((run.result_total - run.result_failed) / run.result_total).toFixed(2));
        }

        c3.generate({
            bindto: '#detail-chart',
            size: {
                height: 240
            },
            data: {
                columns: [
                    passed,
                    failed,
                    skipped,
                    passRate
                ],
                axes: {
                    PassRate: 'y2'
                },
                groups: [
                    ['Passed', 'Failed', 'Other']
                ],
                types: {
                    Failed: 'bar',
                    Passed: 'bar',
                    Other: 'bar',
                    PassRate: 'spline'
                },
                colors: {
                    Passed: config.successColor,
                    Failed: config.failedColor,
                    PassRate: config.warnColor
                }
            },
            axis: {
                x: {
                    type: 'category',
                    categories: runIds
                },
                y: {
                    show: true,
                    tick: {
                        format: function (value) {
                            return value.toFixed(0);
                        },
                        count: 5
                    }
                },

                y2: {
                    show: true,
                    max: 1.0,
                    min: 0.01,
                    tick: {
                        format: d3.format('%'),
                        values: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
                    }
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        if (id === 'PassRate') {
                            return d3.format('%')(value);
                        }
                        return value;
                    }
                }
            }
        });

        c3.generate({
            bindto: '#rate-chart',

            size: {
                height: 240
            },

            data: {
                columns: [
                    ['Passed', window.app.summaryInfo.result_passed],
                    ['Failed', window.app.summaryInfo.result_failed],
                    ['Other', (window.app.summaryInfo.result_total
                    - window.app.summaryInfo.result_failed
                    - window.app.summaryInfo.result_passed)]

                ],
                type: 'pie',
                colors: {
                    Passed: config.successColor,
                    Failed: config.warnColor,
                    Other: config.infoColor
                }
            }
        });
    }


    function resultDetailChartRender(callback) {
        if (window.app.resultHistory === undefined || window.app.summaryInfo === undefined) return;

        let x = ['x'];
        let runIds = [];
        let passed = ['Passed'];
        let failed = ['Failed'];
        let duration = ['Duration'];

        let latest = window.app.resultHistory.results.slice(0, 20);
        for (let result of latest.reverse()) {
            runIds.push('Run: ' + result.run_info.id);
            duration.push(common.hmsToSeconds(result.duration));
            if (result.get_outcome_display === 'Passed') {
                passed.push(1);
                failed.push(0);
            }
            else {
                passed.push(0);
                failed.push(1);
            }
        }

        c3.generate({
            bindto: '#detail-chart',
            size: {
                height: 240
            },
            data: {
                columns: [
                    passed,
                    failed,
                    duration
                ],
                groups: [
                    ['Passed', 'Failed']
                ],
                types: {
                    Failed: 'bar',
                    Passed: 'bar',
                    Duration: 'spline'
                },
                axes: {
                    Duration: 'y2'
                },
                colors: {
                    Passed: config.successColor,
                    Failed: config.failedColor,
                    Duration: config.warnColor
                }
            },
            axis: {
                x: {
                    show: false,
                    type: 'category',
                    categories: runIds
                },
                y: {
                    show: false
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        if (id === 'Duration') {
                            return value + 's';
                        }
                        if (id === 'Passed' && value) {
                            return 'true';
                        }
                        if (id === 'Failed' && value) {
                            return 'true';
                        }
                    }
                }
            }
        });

        c3.generate({
            bindto: '#rate-chart',

            size: {
                height: 240
            },

            data: {
                columns: [
                    ['Passed', window.app.summaryInfo.testcase_exec_info.passed],
                    ['Failed', window.app.summaryInfo.testcase_exec_info.failed],
                    ['Other', window.app.summaryInfo.testcase_exec_info.other]
                ],
                type: 'pie',
                colors: {
                    Passed: config.successColor,
                    Failed: config.warnColor,
                    Other: config.infoColor
                }
            }
        });

        if (callback) return callback();
    }

    return {
        runDetailChartRender: runDetailChartRender,
        resultDetailChartRender: resultDetailChartRender
    };

});

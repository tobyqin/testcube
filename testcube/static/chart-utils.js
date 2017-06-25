"use strict";

function runDetailChartRender() {
    if (my.runList === undefined) return;
    if (my.runInfo.result_total == 0) return;

    let x = ['x'];
    let runIds = [];
    let passed = ['Passed'];
    let failed = ['Failed'];
    let skipped = ['Skipped'];
    let total = ['Total'];
    let passRate = ['PassRate'];

    // get last 10 will be okay
    let latest = my.runList.results.slice(0, 9);
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
                skipped,
                passRate,
                passed,
                failed,

            ],
            axes: {
                Rate: 'y2'
            },
            groups: [
                ['Passed', 'Failed', 'Skipped']
            ],
            types: {
                Failed: 'bar',
                Passed: 'bar',
                Skipped: 'bar',
                PassRate: 'spline'
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
                },
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
                ['Skipped', my.runInfo.result_skipped],
                ['Failed', my.runInfo.result_failed],
                ['Passed', my.runInfo.result_passed],
            ],
            type: 'pie'
        }
    });
}

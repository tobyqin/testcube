"use strict";

my.runListFilter = {};

function runIdFormatter(id) {
    return `<a href="/runs/${id}">${id}</a>`;
}

function resultIdFormatter(id) {
    return `<a href="/results/${id}">${id}</a>`;
}

function caseIdFormatter(id) {
    return `<a href="/testcases/${id}">${id}</a>`;
}

function rateFormatter(rate) {
    if (rate === undefined) return;
    let percentNum = rate.passed / rate.total;
    let percent = percentNum.toLocaleString('en', {style: "percent"});

    if (isNaN(percentNum)) {
        percentNum = 0;
    }

    let color = getColor(percentNum);
    return `<a href="/runs/${rate.id}" 
                data-toggle="tooltip" 
                title="${rate.passed} / ${rate.total}"
                style="color: ${color};text-decoration: none"
                >${percent}</a>`
}

function timeHumanFormatter(time) {
    return moment(time).fromNow();
}

function timeFormatter(time) {
    return moment(time).calendar();
}

function outcomeFormatter(outcome) {
    let cls = 'text-danger';
    if (outcome === 'Skipped') {
        cls = 'text-warning';
    }
    else if (outcome === 'Passed') {
        cls = 'text-success';
    }
    return `<p class="${cls}">${outcome}</p>`;
}

function runListQueryParams(params) {
    if (params.sort !== undefined) {
        let re = /(\w+)(\..*)/; // e.g. product.name => product

        params.ordering = params.sort.replace(re, '$1');
        if (params.order !== 'asc') {
            params.ordering = '-' + params.ordering;
        }

        delete params.sort;
        delete params.order;
    }

    if (my.runListFilter.product) {
        params.product = my.runListFilter.product;
    }
    if (my.runListFilter.team) {
        params.team = my.runListFilter.team;
    }

    return params;
}

function caseListQueryParams(params) {
    if (params.sort !== undefined) {
        let re = /(\w+)(\..*)/; // e.g. product.name => product

        params.ordering = params.sort.replace(re, '$1');
        if (params.order !== 'asc') {
            params.ordering = '-' + params.ordering;
        }

        delete params.sort;
        delete params.order;
    }

    return params;
}

function runListTableDataHandler(data) {
    data.total = data.count;
    data.rows = data.results;
    for (let r of data.results) {
        r.passing_rate = {
            id: r.id,
            passed: r.result_total - r.result_failed,
            total: r.result_total
        };
        r.product_name = r.product.name;
        r.team_name = r.team.name;
    }
    my.runList = data;
    return data;
}

function runListTableFilter() {
    $('#table').bootstrapTable('refresh');
}

function runListPickerChanged(e, index, newVal, oldVal) {
    if (e.target.id == 'team-picker') {
        let picker = $('#team-picker');
        let value = picker.selectpicker('val');
        if (value) {
            my.runListFilter.team = value;
        }
        else {
            delete my.runListFilter.team;
        }

        runListTableFilter();
    }
    if (e.target.id == 'product-picker') {
        let picker = $('#product-picker');
        let value = picker.selectpicker('val');
        if (value) {
            my.runListFilter.product = value;
        }
        else {
            delete my.runListFilter.product;
        }

        runListTableFilter();
    }
}

function runListFilterRender() {
    $.get('/api/products/recent/', function (data) {
        for (let obj of data.results) {
            $('#product-picker').append(`<option value="${obj.id}">${obj.name}</option>`);
            $('.selectpicker').selectpicker('refresh');
        }
    });
    $.get('/api/teams/recent/', function (data) {
        for (let obj of data.results) {
            $('#team-picker').append(`<option value="${obj.id}">${obj.name}</option>`);
            $('.selectpicker').selectpicker('refresh');
        }
    });
}

function runListTablePostEvent(data) {
    if (data[0] === undefined) return;
    $("[data-toggle='tooltip']").tooltip();
    if (my.setFilters) return;
    runListFilterRender();
    $('.selectpicker').on('changed.bs.select', runListPickerChanged);
    my.setFilters = true;
}

function runListTableRender(url) {
    $('#table').bootstrapTable({
        sidePagination: 'server',
        url: url,
        queryParams: runListQueryParams,
        responseHandler: runListTableDataHandler,
        toolbar: '#toolbar',
        search: true,
        pagination: true,
        pageSize: 20,
        pageList: [20, 30, 50, 100],
        showColumns: true,
        sortable: true,
        showFooter: false,
        columns: [
            {title: 'ID', field: 'id', formatter: runIdFormatter, sortable: true},
            {title: 'Team', field: 'team.name', sortable: true},
            {title: 'Product', field: 'product.name', sortable: true},
            {title: 'Title', field: 'name', sortable: true},
            {title: 'Start Time', field: 'start_time', formatter: timeHumanFormatter, sortable: true},
            {title: 'Duration', field: 'duration', sortable: true, visible: false},
            {title: 'Start By', field: 'start_by', sortable: true, visible: false},
            {
                title: 'Passing',
                field: 'passing_rate',
                formatter: rateFormatter,
            },
            {title: 'State', field: 'get_state_display'}
        ],
        onPostBody: runListTablePostEvent,
        cookie: true,
        cookieExpire: '1y',
        cookieIdTable: 'runListTable'
    });

}

function runDetailPageRender(runId) {
    $('#run-summary').bootstrapTable({
        url: `/api/runs/${ runId }/info/`,
        responseHandler: runDetailSummaryDataHandler,
        search: false,
        pagination: false,
        sortable: true,
        showFooter: false,
        columns: [
            {title: 'ID', field: 'id'},
            {title: 'Team', field: 'team.name'},
            {title: 'Product', field: 'product.name'},
            {title: 'Name', field: 'name'},
            {title: 'Start Time', field: 'start_time', formatter: timeFormatter},
            {title: 'Duration', field: 'duration'},
            {title: 'Start By', field: 'start_by'},
            {title: 'Passed', field: 'result_passed'},
            {title: 'Failed', field: 'result_failed'},
            {title: 'Total', field: 'result_total'},
            {title: 'Status', field: 'get_status_display'}
        ],
        onPostBody: runDetailSummaryPostEvent
    });
}

function runHistoryTableRender(runId) {
    $('#run-history').bootstrapTable({
        sidePagination: 'server',
        url: `/api/runs/${ runId }/history/`,
        responseHandler: runListTableDataHandler,
        search: false,
        pagination: false,
        showFooter: false,
        sortable: false,
        columns: [
            {title: 'ID', field: 'id', formatter: runIdFormatter},
            {title: 'Team', field: 'team.name'},
            {title: 'Product', field: 'product.name'},
            {title: 'Title', field: 'name'},
            {title: 'Start Time', field: 'start_time', formatter: timeHumanFormatter},
            {title: 'Duration', field: 'duration'},
            {title: 'Start By', field: 'start_by'},
            {
                title: 'Passing',
                field: 'passing_rate',
                formatter: rateFormatter
            },
            {title: 'State', field: 'get_state_display'}
        ],
        onPostBody: runDetailChartRender
    });
}

function runDetailChartRender(data) {
    if (my.runList === undefined) return;
    if (my.runInfo.result_total == 0) return;

    let x = ['x'];
    let runIds = [];
    let passed = ['passed'];
    let failed = ['failed'];
    let skipped = ['skipped'];
    let total = ['total'];
    let passRate = ['passRate'];

    // get last 10 will be okay
    let latest = data.slice(0, 10);
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
                passRate: 'y2'
            },
            groups: [
                ['passed', 'failed', 'skipped']
            ],
            types: {
                failed: 'bar',
                passed: 'bar',
                skipped: 'bar',
                passRate: 'spline'
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
                    if (id === 'passRate') {
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

function caseDetailSummaryDataHandler(data) {
    my.caseInfo = data;
    return [data];
}

function caseDetailSummaryTablePostEvent(data) {
    if (data[0] === undefined) return;
    let testcase = data[0];
    let nav = `${testcase.id} - ${testcase.name}`;
    $('#case-nav').empty().append(nav);
}

function runDetailSummaryDataHandler(data) {
    my.runInfo = data;
    return [data];
}

function runDetailSummaryPostEvent(data) {
    if (data[0] === undefined) return;
    let run = data[0];
    let nav = `${run.id} - ${run.name}`;
    $('#run-nav').empty().append(nav);
    let passed = [];
    let failed = [];
    for (let result of my.runInfo.results) {
        if (result.get_outcome_display === 'Failed') {
            failed.push(result);
        } else {
            passed.push(result);
        }
    }

    $('#result-failed-list').bootstrapTable({
        data: failed,
        search: true,
        pagination: true,
        pageSize: 100,
        pageList: [100, 200],
        sortName: 'id',
        sortOrder: 'desc',
        sortable: true,
        showFooter: false,
        columns: [
            {title: 'ID', field: 'id', formatter: resultIdFormatter, sortable: true},
            {title: 'TestCase', field: 'testcase_info.name', sortable: true},
            {title: 'Duration', field: 'duration', sortable: true},
            {title: 'Assigned To', field: 'assigned_to', sortable: true},
            {title: 'Client', field: 'test_client.name', sortable: true},
            {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter, sortable: true}
        ],
        onPostBody: undefined
    });

    $('#result-passed-list').bootstrapTable({
        data: passed,
        search: true,
        pagination: true,
        pageSize: 100,
        pageList: [100, 200],
        sortName: 'id',
        sortOrder: 'desc',
        sortable: true,
        showFooter: false,
        columns: [
            {title: 'ID', field: 'id', formatter: resultIdFormatter, sortable: true},
            {title: 'TestCase', field: 'testcase_info.name', sortable: true},
            {title: 'Duration', field: 'duration', sortable: true},
            {title: 'Assigned To', field: 'assigned_to', sortable: true},
            {title: 'Client', field: 'test_client.name', sortable: true},
            {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter, sortable: true}
        ],
        onPostBody: undefined
    });

    runHistoryTableRender(run.id);
}

function resultDetailSummaryDataHandler(data) {
    my.resultInfo = data;
    return [data];
}

function resultDetailSummaryPostEvent(data) {
    if (data[0] === undefined) return;
    let result = data[0];
    let stderr = "Nothing found.";
    let stdout = "Nothing found.";

    if (result.error) {
        stderr = result.error.message + '\n\n' + result.error.stacktrace;
    }
    if (result.stdout) {
        stdout = "";
        stdout = stdout + result.stdout;
    }

    $('#stderr').empty().append(stderr);
    $('#stdout').empty().append(stdout);

    if (result.test_run) {
        let nav = `<a href="/runs/${result.test_run.id}">${result.test_run.id} - ${result.test_run.name}</a>`;
        $('#run-nav').empty().append(nav);
    }
    if (result.testcase) {
        let nav = `${result.id} - ${result.testcase.name}`;
        $('#result-nav').empty().append(nav);

        $('#result-history').bootstrapTable({
            url: `/api/cases/${result.testcase.id}/history/`,
            responseHandler: resultHistoryTableDataHandler,
            search: false,
            pagination: false,
            sortName: 'id',
            sortOrder: 'desc',
            sortable: false,
            showFooter: false,
            columns: [
                {title: 'ID', field: 'id', formatter: resultIdFormatter,},
                {title: 'TestCase', field: 'testcase_info.name'},
                {title: 'Run On', field: 'run_info.start_time', formatter: timeFormatter},
                {title: 'Duration', field: 'duration'},
                {title: 'Error Message', field: 'error_message'},
                {title: 'Client', field: 'test_client.name'},
                {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter}
            ],
            onPostBody: undefined
        });
    }


}

function resultHistoryTableDataHandler(data) {
    return data.results;
}

function resultDetailPageRender(resultId) {
    $('#table').bootstrapTable({
        url: `/api/results/${ resultId }/info/`,
        responseHandler: resultDetailSummaryDataHandler,
        search: false,
        pagination: false,
        sortName: 'id',
        sortOrder: 'desc',
        sortable: false,
        showFooter: false,
        columns: [
            {title: 'ID', field: 'id'},
            {title: 'TestCase', field: 'testcase.name'},
            {title: 'Duration', field: 'duration'},
            {title: 'Assigned To', field: 'assigned_to'},
            {title: 'Client', field: 'test_client.name'},
            {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter}
        ],
        onPostBody: resultDetailSummaryPostEvent
    });
}

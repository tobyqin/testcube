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

function rateSorter(a, b) {
    let x = (a.passed / a.total);
    let y = (b.passed / b.total);
    if (isNaN(x)) x = -1;
    if (isNaN(y)) y = -1;
    if (x > y) return 1;
    if (x < y)return -1;
    return 0;
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

function runListTableDataHandler(data) {
    my.data = data;
    let rows = data.results;
    for (let r of rows) {
        r.passing_rate = {
            id: r.id,
            passed: r.result_total - r.result_failed,
            total: r.result_total
        };
        r.product_name = r.product.name;
        r.team_name = r.team.name;
    }
    return rows;
}

function runListTableFilter() {
    $('#table').bootstrapTable('filterBy', my.runListFilter);
}

function runListPickerChanged(e, index, newVal, oldVal) {
    if (e.target.id == 'team-picker') {
        let picker = $('#team-picker');
        let value = picker.selectpicker('val');
        if (value) {
            my.runListFilter.team_name = value;
        }
        else {
            delete my.runListFilter.team_name;
        }

        runListTableFilter();
    }
    if (e.target.id == 'product-picker') {
        let picker = $('#product-picker');
        let value = picker.selectpicker('val');
        if (value) {
            my.runListFilter.product_name = value;
        }
        else {
            delete my.runListFilter.product_name;
        }

        runListTableFilter();
    }

}

function runListTablePostEvent(data) {
    if (data[0] === undefined) return;
    $("[data-toggle='tooltip']").tooltip();
    if (my.setFilters) return;

    let products = [];
    let teams = [];
    for (let run of data) {
        products.push(run.product.name);
        teams.push(run.team.name);
    }
    products = [...new Set(products)];
    teams = [...new Set(teams)];
    for (let obj of products) {
        $('#product-picker').append(`<option value="${obj}">${obj}</option>`);
    }
    for (let obj of teams) {
        $('#team-picker').append(`<option value="${obj}">${obj}</option>`);
    }

    $('.selectpicker').selectpicker('refresh')
        .on('changed.bs.select', runListPickerChanged);

    my.setFilters = true;
}

function runListTableRender(url) {
    $('#table').bootstrapTable({
        sidePagination: 'client',
        url: url,
        responseHandler: runListTableDataHandler,
        toolbar: '#toolbar',
        search: true,
        pagination: true,
        pageSize: 30,
        pageList: [30, 50, 100],
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
                sorter: rateSorter,
                sortable: true
            },
            {title: 'State', field: 'get_state_display', sortable: true}
        ],
        onPostBody: runListTablePostEvent,
        cookie: true,
        cookieExpire: '1y',
        cookieIdTable: 'runListTable'
    });

}

function runDetailSummaryTableRender(url) {
    $('#run-summary').bootstrapTable({
        url: url,
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

function runHistoryTableRender(url) {
    $('#run-history').bootstrapTable({
        sidePagination: 'client',
        url: url,
        responseHandler: runListTableDataHandler,
        search: false,
        pagination: false,
        showFooter: false,
        columns: [
            {title: 'ID', field: 'id', formatter: runIdFormatter, sortable: true},
            {title: 'Team', field: 'team.name', sortable: true},
            {title: 'Product', field: 'product.name', sortable: true},
            {title: 'Title', field: 'name', sortable: true},
            {title: 'Start Time', field: 'start_time', formatter: timeHumanFormatter, sortable: true},
            {title: 'Duration', field: 'duration', sortable: true},
            {title: 'Start By', field: 'start_by', sortable: true},
            {
                title: 'Passing',
                field: 'passing_rate',
                formatter: rateFormatter,
                sorter: rateSorter,
                sortable: true
            },
            {title: 'State', field: 'get_state_display', sortable: true}
        ],
        onPostBody: undefined
    });
}

function caseDetailSummaryDataHandler(data) {
    my.data = data;
    return [data];
}

function caseDetailSummaryTablePostEvent(data) {
    if (data[0] === undefined) return;
    let testcase = data[0];
    let nav = `${testcase.id} - ${testcase.name}`;
    $('#case-nav').empty().append(nav);
}

function runDetailSummaryDataHandler(data) {
    my.data = data;
    return [data];
}

function runDetailSummaryPostEvent(data) {
    if (data[0] === undefined) return;
    let run = data[0];
    let nav = `${run.id} - ${run.name}`;
    $('#run-nav').empty().append(nav);

    $('#result-list').bootstrapTable({
        data: my.data.results,
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
}

function resultDetailSummaryDataHandler(data) {
    my.data = data;
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

function runDetailChartRendering() {
    let chart = c3.generate({
        bindto: '#detail-chart',
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25]
            ],
            axes: {
                data2: 'y2' // ADD
            }
        },
        axis: {
            y2: {
                show: true // ADD
            }
        }
    });

    c3.generate({
        bindto: '#rate-chart',
        data: {
            columns: [
                ['data1', 30],
                ['data2', 120],
            ],
            type: 'pie'
        }
    });
}

"use strict";

function runIdFormatter(id) {
    return `<a href="/runs/${id}">${id}</a>`
}

function resultIdFormatter(id) {
    return `<a href="/results/${id}">${id}</a>`
}


function rateFormatter(rate) {
    let percent = (rate.passed / rate.total).toLocaleString('en', {style: "percent"});
    return `<a href="/runs/${rate.id}" data-toggle="tooltip" title="${rate.passed} / ${rate.total}">${percent}</a>`
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

function timeFormatter(time) {
    return moment(time).fromNow()
}

function runTableDataHandler(data) {
    my.data = data;
    let rows = data.results;
    for (let r of rows) {
        r.start_time = moment(r.start_time).fromNow();
        r.passing_rate = {
            id: r.id,
            passed: r.result_total - r.result_failed,
            total: r.result_total
        };
    }
    return rows;
}

function runTablePostEvent(data) {
    $("[data-toggle='tooltip']").tooltip();
}

function runDetailSummaryDataHandler(data) {
    my.data = data;
    return [data];
}

function runDetailTablePostEvent(data) {
    if (data[0] === undefined) return;
    let run = data[0];
    let nav = `<a href="/runs/${run.id}">${run.id} - ${run.name}</a>`;
    $('#run-nav').empty().append(nav);

    $('#result-list').bootstrapTable({
        data: my.data.results,
        search: true,
        pagination: true,
        pageSize: 20,
        pageList: [20, 30, 50, 100],
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
            {title: 'Outcome', field: 'get_outcome_display', sortable: true}
        ],
        onPostBody: undefined
    });
}


function resultDetailTableDataHandler(data) {
    my.data = data;
    return [data];
}

function resultDetailTablePostEvent(data) {
    if (data[0] === undefined) return;
    let result = data[0];
    let stdout = "";

    if (result.error) {
        stdout = result.error.message + '\n\n' + result.error.stacktrace;
        stdout = stdout + '\n\n---------------------------------------\n\n'
    }
    if (result.stdout) {
        stdout = stdout + result.stdout;
    }

    $('#stdout').empty().append(stdout);

    if (result.test_run) {
        let nav = `<a href="/runs/${result.test_run.id}">${result.test_run.id} - ${result.test_run.name}</a>`;
        $('#run-nav').empty().append(nav);
    }
    if (result.testcase) {
        let nav = `${result.id} - ${result.testcase.name}`;
        $('#result-nav').empty().append(nav);
    }
}

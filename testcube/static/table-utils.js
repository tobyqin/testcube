"use strict";

my.toolbarFilter = {};

function refineQueryParams(params) {
    // update params to django style:
    if (params.sort !== undefined) {
        let re = /(\w+)(\..*)/; // e.g. product.name => product
        params.ordering = params.sort.replace(re, '$1');

        // sort=id&order=desc => ordering=id or ordering=-id
        if (params.order !== 'asc') {
            params.ordering = '-' + params.ordering;
        }

        // remove unsupported params
        delete params.sort;
        delete params.order;
    }

    if (my.toolbarFilter.product) {
        params.product = my.toolbarFilter.product;
    }
    if (my.toolbarFilter.team) {
        params.product__team = my.toolbarFilter.team;
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
    }
    my.runList = data;
    return data;
}

function refreshTableByFilter() {
    $('#table').bootstrapTable('refresh');
}

function toolbarPickerChanged(e, index, newVal, oldVal) {
    if (e.target.id === 'team-picker') {
        let picker = $('#team-picker');
        let value = picker.selectpicker('val');
        if (value) {
            my.toolbarFilter.team = value;
        }
        else {
            delete my.toolbarFilter.team;
        }

        refreshTableByFilter();
    }
    if (e.target.id === 'product-picker') {
        let picker = $('#product-picker');
        let value = picker.selectpicker('val');
        if (value) {
            my.toolbarFilter.product = value;
        }
        else {
            delete my.toolbarFilter.product;
        }

        refreshTableByFilter();
    }
}

function toolbarFilterRender() {
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
    toolbarTablePostEvent(data);
    $("[data-toggle='tooltip']").tooltip();
}


function toolbarTablePostEvent(data) {
    if (data[0] === undefined) return;
    if (my.setFilters) return;
    toolbarFilterRender();
    $('.selectpicker').on('changed.bs.select', toolbarPickerChanged);
    my.setFilters = true;
}


function runListTableRender(url) {
    $('#table').bootstrapTable($.extend(my.defaultTableOptions, {
        url: url,
        queryParams: refineQueryParams,
        responseHandler: runListTableDataHandler,
        toolbar: '#toolbar',
        showColumns: true,
        columns: my.runListColumns,
        onPostBody: runListTablePostEvent,
        cookie: true,
        cookieExpire: '1y',
        cookieIdTable: 'runListTable'
    }));
}

function runDetailPageRender(runId) {
    $('#run-summary').bootstrapTable($.extend(my.defaultTableOptions, {
        url: `/api/runs/${ runId }/info/`,
        responseHandler: summaryDataHandler,
        sidePagination: 'client',
        search: false,
        pagination: false,
        sortable: false,
        columns: my.runDetailColumns,
        onPostBody: runDetailSummaryPostEvent
    }));
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
        columns: my.runHistoryColumns,
        onPostBody: runDetailChartRender
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

function runDetailSummaryPostEvent(data) {
    if (data[0] === undefined) return;

    let run = data[0];
    let nav = `${run.id} - ${run.name}`;
    $('#run-nav').empty().append(nav);

    let passed = [];
    let failed = [];
    for (let result of my.summaryInfo.results) {
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
        sortable: true,
        showFooter: false,
        columns: my.runFailedResultColumns,
        onPostBody: undefined
    });

    $('#result-passed-list').bootstrapTable({
        data: passed,
        search: true,
        pagination: true,
        pageSize: 100,
        pageList: [100, 200],
        sortable: true,
        showFooter: false,
        columns: my.runPassedResultColumns,
        onPostBody: undefined
    });

    runHistoryTableRender(run.id);
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
            sortable: false,
            showFooter: false,
            columns: my.resultHistoryColumns,
            onPostBody: resultDetailChartRender
        });
    }
}

function resultHistoryTableDataHandler(data) {
    my.resultHistory = data;
    return data.results;
}

function resultDetailPageRender(resultId) {
    $('#table').bootstrapTable({
        url: `/api/results/${ resultId }/info/`,
        responseHandler: summaryDataHandler,
        search: false,
        pagination: false,
        sortName: 'id',
        sortOrder: 'desc',
        sortable: false,
        showFooter: false,
        columns: my.resultDetailColumns,
        onPostBody: resultDetailSummaryPostEvent
    });
}

function caseListTableRender(url) {
    $('#table').bootstrapTable({
        sidePagination: 'server',
        url: url,
        responseHandler: function (data) {
            data.total = data.count;
            data.rows = data.results;
            return data;
        },
        queryParams: refineQueryParams,
        toolbar: '#toolbar',
        search: true,
        pagination: true,
        pageSize: 20,
        pageList: [20, 50, 100],
        sortName: 'id',
        sortOrder: 'desc',
        columns: my.caseListColumns,
        onPostBody: toolbarTablePostEvent,
    });
}

function caseDetailTableRender(caseId) {
    $('#case-summary').bootstrapTable({
        url: `/api/cases/${caseId}/info/`,
        responseHandler: caseDetailSummaryDataHandler,
        search: false,
        pagination: false,
        sortable: true,
        cardView: true,
        showFooter: false,
        columns: my.caseDetailColumns,
        onPostBody: caseDetailSummaryTablePostEvent
    });

    $('#case-history').bootstrapTable({
        sidePagination: 'client',
        url: `/api/cases/${caseId}/history/`,
        responseHandler: resultHistoryTableDataHandler,
        search: false,
        pagination: false,
        showFooter: false,
        columns: my.caseHistoryColumns,
        onPostBody: undefined
    });
}

function resultListTableRender(url) {
    $('#table').bootstrapTable({
        sidePagination: 'server',
        url: url,
        responseHandler: function (data) {
            data.total = data.count;
            data.rows = data.results;
            return data;
        },
        queryParams: refineQueryParams,
        search: true,
        pagination: true,
        pageSize: 20,
        pageList: [20, 50, 100],
        sortName: 'id',
        sortOrder: 'desc',
        columns: my.resultListColumns,
    });
}

function lastStep() {
    if (my.showAnalysisForm) {
        $('.nav a:last').tab('show');
        window.scrollTo(0, document.body.scrollHeight);
    }
}

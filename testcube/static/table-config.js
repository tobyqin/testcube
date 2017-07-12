"use strict";

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

function durationFormatter(duration) {
    if (duration) {
        return duration.replace(/(.*)\.(.*)/, '$1')
    } else {
        return '--';
    }
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

function summaryDataHandler(data) {
    my.summaryInfo = data;
    return [data];
}

my.defaultTableOptions = {
    sidePagination: 'server',
    search: true,
    pagination: true,
    pageSize: 20,
    pageList: [20, 30, 50, 100],
    sortable: true,
    showFooter: false
};

my.runListColumns = [
    {title: 'ID', field: 'id', formatter: runIdFormatter, sortable: true},
    {title: 'Team', field: 'team_name'},
    {title: 'Product', field: 'product_name'},
    {title: 'Title', field: 'name', sortable: true},
    {title: 'Start Time', field: 'start_time', formatter: timeHumanFormatter, sortable: true},
    {title: 'Duration', field: 'duration', formatter: durationFormatter, sortable: true, visible: false},
    {title: 'Start By', field: 'start_by', sortable: true, visible: false},
    {
        title: 'Passing',
        field: 'passing_rate',
        formatter: rateFormatter
    },
    {title: 'State', field: 'get_state_display'}
];

my.runDetailColumns = [
    {title: 'ID', field: 'id'},
    {title: 'Team', field: 'team_name'},
    {title: 'Product', field: 'product_name'},
    {title: 'Name', field: 'name'},
    {title: 'Start Time', field: 'start_time', formatter: timeFormatter},
    {title: 'Duration', field: 'duration', formatter: durationFormatter},
    {title: 'Start By', field: 'start_by'},
    {title: 'Passed', field: 'result_passed'},
    {title: 'Failed', field: 'result_failed'},
    {title: 'Total', field: 'result_total'},
    {title: 'Status', field: 'get_status_display'}
];

my.runFailedResultColumns = [
    {title: 'ID', field: 'id', formatter: resultIdFormatter, sortable: true},
    {title: 'TestCase', field: 'testcase_info.name', sortable: true},
    {title: 'Duration', field: 'duration', formatter: durationFormatter, sortable: true},
    {title: 'Error Message', field: 'error_message', sortable: true},
    {title: 'Reason', field: 'reason', sortable: true},
    {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter, sortable: true}
];

my.runPassedResultColumns = [
    {title: 'ID', field: 'id', formatter: resultIdFormatter, sortable: true},
    {title: 'TestCase', field: 'testcase_info.name', sortable: true},
    {title: 'Duration', field: 'duration', formatter: durationFormatter, sortable: true},
    {title: 'Assigned To', field: 'assigned_to', sortable: true},
    {title: 'Client', field: 'test_client.name', sortable: true},
    {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter, sortable: true}
];

my.runHistoryColumns = [
    {title: 'ID', field: 'id', formatter: runIdFormatter},
    {title: 'Team', field: 'team_name'},
    {title: 'Product', field: 'product_name'},
    {title: 'Title', field: 'name'},
    {title: 'Start Time', field: 'start_time', formatter: timeHumanFormatter},
    {title: 'Duration', field: 'duration', formatter: durationFormatter},
    {title: 'Start By', field: 'start_by'},
    {
        title: 'Passing',
        field: 'passing_rate',
        formatter: rateFormatter
    },
    {title: 'State', field: 'get_state_display'}
];

my.resultDetailColumns = [
    {title: 'ID', field: 'id'},
    {title: 'TestCase', field: 'testcase.name'},
    {title: 'Duration', field: 'duration', formatter: durationFormatter},
    {title: 'Passed Times', field: 'testcase_exec_info.passed'},
    {title: 'Failed Times', field: 'testcase_exec_info.failed'},
    {title: 'Total Execution', field: 'testcase_exec_info.total'},
    {title: 'Assigned To', field: 'assigned_to'},
    {title: 'Client', field: 'test_client.name'},
    {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter}
];

my.resultHistoryColumns = [
    {title: 'ID', field: 'id', formatter: resultIdFormatter},
    {title: 'Run On', field: 'run_info.start_time', formatter: timeFormatter},
    {title: 'Duration', field: 'duration', formatter: durationFormatter},
    {title: 'Error Message', field: 'error_message'},
    {title: 'Reason', field: 'reason'},
    {title: 'Issue', field: 'issue_id'},
    {title: 'Client', field: 'test_client.name'},
    {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter}
];

my.caseListColumns = [
    {title: 'ID', field: 'id', formatter: caseIdFormatter, sortable: true},
    {title: 'Team', field: 'team_name'},
    {title: 'Product', field: 'product_name'},
    {title: 'Name', field: 'name', sortable: true},
    {title: 'Priority', field: 'priority', sortable: true},
    {title: 'Owner', field: 'owner', sortable: true},
    {title: 'Updated On', field: 'updated_on', formatter: timeFormatter, sortable: true}
];

my.caseDetailColumns = [
    {title: 'ID', field: 'id'},
    {title: 'Team', field: 'team.name'},
    {title: 'Product', field: 'product.name'},
    {title: 'Name', field: 'name'},
    {title: 'FullName', field: 'full_name'},
    {title: 'Keyword', field: 'keyword'},
    {title: 'Priority', field: 'priority'},
    {title: 'Description', field: 'description'},
    {title: 'Created On', field: 'created_on', formatter: timeFormatter},
    {title: 'Update On', field: 'updated_on', formatter: timeFormatter},
    {title: 'Created By', field: 'created_by'},
    {title: 'Owner', field: 'owner'}
];

my.caseHistoryColumns = [
    {title: 'ID', field: 'id', formatter: resultIdFormatter},
    {title: 'TestCase', field: 'testcase_info.name'},
    {title: 'Run On', field: 'run_info.start_time', formatter: timeFormatter},
    {title: 'Duration', field: 'duration', formatter: durationFormatter},
    {title: 'Error Message', field: 'error_message'},
    {title: 'Client', field: 'test_client.name'},
    {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter}
];


my.resultListColumns = [
    {title: 'ID', field: 'id', formatter: resultIdFormatter, sortable: true},
    {title: 'TestCase', field: 'testcase_name'},
    {title: 'Message', field: 'error_message'},
    {title: 'Created On', field: 'created_on', formatter: timeFormatter},
    {title: 'Duration', field: 'duration', formatter: durationFormatter},
    {title: 'Outcome', field: 'get_outcome_display', formatter: outcomeFormatter}
];

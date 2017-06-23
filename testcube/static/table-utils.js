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

function runTableDataHandler(data) {
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

function runListFilter() {
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

        runListFilter();
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

        runListFilter();
    }

}

function runTablePostEvent(data) {
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

function runDetailSummaryDataHandler(data) {
    my.data = data;
    return [data];
}

function runDetailTablePostEvent(data) {
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

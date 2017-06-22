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

function resultTableDataHandler(data) {
    my.data = data;
    let rows = data.results;
    for (let r of rows) {
        r.start_time = moment(r.start_time).fromNow();
    }
    return rows;
}

function resultTablePostEvent(data) {
    console.log(data)
}

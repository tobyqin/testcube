define(['moment', './utils', 'bootstrapTable'], function (moment, utils) {

    "use strict";
    let support = {};
    let formatter = {};
    let toolbarFilter = {};

    formatter.runIdFormatter = function (id) {
        return `<a target="_blank"  href="/runs/${id}">${id}</a>`;
    };

    formatter.resultIdFormatter = function (id) {
        return `<a target="_blank" href="/results/${id}">${id}</a>`;
    };

    formatter.caseIdFormatter = function (id) {
        return `<a target="_blank" href="/testcases/${id}">${id}</a>`;
    };

    formatter.caseNameFormatter = function (caseInfo) {
        return `<a target="_blank" href="/testcases/${caseInfo.id}">${caseInfo.name}</a>`;
    };

    formatter.rateFormatter = function (rate) {
        if (rate === undefined) return;
        let percentNum = rate.passed / rate.total;
        let percent = percentNum.toLocaleString('en', {style: "percent"});

        if (isNaN(percentNum)) {
            percentNum = 0;
        }

        let color = utils.getColor(percentNum);
        let weather = utils.getWeather(percentNum);
        return `<a href="/runs/${rate.id}" 
                data-toggle="tooltip" 
                title="${rate.passed} / ${rate.total}"
                style="color: ${color};text-decoration: none"
                ><i class="wi ${weather}"></i>  ${percent}</a>`
    };

    formatter.runStateFormatter = function (state) {
        let icon = 'time';
        if (state === 'Aborted') icon = 'remove';
        if (state === 'Completed') icon = 'ok';
        return `<i style="color:#6f6f6f" class="glyphicon glyphicon-${icon}"></i> ${state}`;
    };

    formatter.timeHumanFormatter = function (time) {
        return moment(time).fromNow();
    };

    formatter.timeFormatter = function (time) {
        let out = moment(time).calendar();
        if (out === 'Invalid date') return '…(⊙_⊙;)…';
        return out;
    };

    formatter.durationFormatter = function (duration) {
        if (duration) {
            return duration.replace(/(.*)\.(.*)/, '$1')
        } else {
            return '--';
        }
    };

    formatter.outcomeFormatter = function (outcome) {
        let cls = 'text-danger';
        let icon = 'remove-sign';
        if (outcome === 'Skipped') {
            cls = 'text-warning';
            icon = 'minus-sign';
        }
        else if (outcome === 'Passed') {
            cls = 'text-success';
            icon = 'ok-sign';
        }
        return `<span class="${cls}"><i class="glyphicon glyphicon-${icon}"></i> ${outcome}</span>`;
    };

    formatter.imageUrlFormatter = function (url) {
        let filename = /[^\/]*$/.exec(url)[0];
        return `<a href="${url}" data-toggle="lightbox" data-title="${filename}" data-gallery="result-gallery">${url}</a>`;
    };

    formatter.resetDetailFormatter = function (error) {
        let message = 'Nothing in output.';
        if (typeof error === 'string') {
            message = error;
        } else if (error) {
            message = error.message + '||' + error.stacktrace + '||' + error.stdout;
        }
        message = utils.safeMessage(message);
        return `<a class="reset-result" data-text="${message}">View</a>`;
    };

    support.defaultTableOptions = {
        sidePagination: 'server',
        search: true,
        pagination: true,
        pageSize: 20,
        pageList: [20, 30, 50, 100],
        sortable: true,
        showFooter: false
    };

    support.refineQueryParams = function (params) {
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

        if (toolbarFilter.product) {
            params.product = toolbarFilter.product;
        }
        if (toolbarFilter.team) {
            params.product__team = toolbarFilter.team;
        }

        return params;
    };

    let refreshTableByFilter = function () {
        $('#table').bootstrapTable('refresh');
    };

    support.toolbarPickerChanged = function (e, index, newVal, oldVal) {
        if (e.target.id === 'team-picker') {
            let picker = $('#team-picker');
            let value = picker.selectpicker('val');
            if (value) {
                toolbarFilter.team = value;
            }
            else {
                delete toolbarFilter.team;
            }

            refreshTableByFilter();
        }
        if (e.target.id === 'product-picker') {
            let picker = $('#product-picker');
            let value = picker.selectpicker('val');
            if (value) {
                toolbarFilter.product = value;
            }
            else {
                delete toolbarFilter.product;
            }

            refreshTableByFilter();
        }
    };

    support.renderToolbarFilter = function () {
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
    };

    support.toolbarTablePostEvent = function (data) {
        if (data[0] === undefined) return;
        if (window.app.setFilters) return;
        support.renderToolbarFilter();
        $('.selectpicker').on('changed.bs.select', support.toolbarPickerChanged);
        window.app.setFilters = true;
    };

    support.formatter = formatter;
    return support;

});

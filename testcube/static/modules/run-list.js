define(['jquery', './table-support', 'bootstrapTableCookie', 'bootstrapSelect'],
    function ($, support) {

        "use strict";
        let f = support.formatter;

        let runListColumns = [
            {title: 'ID', field: 'id', formatter: f.runIdFormatter, sortable: true},
            {title: 'Team', field: 'team_name'},
            {title: 'Product', field: 'product_name'},
            {title: 'Title', field: 'name', sortable: true},
            {title: 'Start Time', field: 'start_time', formatter: f.timeHumanFormatter, sortable: true},
            {
                title: 'Duration',
                field: 'duration',
                formatter: f.durationFormatter,
                sortable: true,
                visible: false
            },
            {title: 'Start By', field: 'start_by', sortable: true, visible: false},
            {
                title: 'Passing',
                field: 'passing_rate',
                formatter: f.rateFormatter
            },
            {title: 'State', field: 'get_state_display', formatter: f.runStateFormatter}
        ];


        function renderRunListTable(url) {
            $('#table').bootstrapTable($.extend(support.defaultTableOptions, {
                url: url,
                queryParams: support.refineQueryParams,
                responseHandler: runListTableDataHandler,
                toolbar: '#toolbar',
                showColumns: true,
                columns: runListColumns,
                onPostBody: runListTablePostEvent,
                cookie: true,
                cookieExpire: '1y',
                cookieIdTable: 'runListTable'
            }));
        }

        function runListTableDataHandler(data) {
            data.total = data.count;
            data.rows = data.results;
            for (let r of data.results) {
                r.passing_rate = {
                    id: r.id,
                    passed: r.result_passed,
                    total: r.result_total
                };
            }
            window.app.runList = data;
            return data;
        }

        function runListTablePostEvent(data) {
            if (data[0] === undefined) return;
            support.toolbarTablePostEvent(data);
            $("[data-toggle='tooltip']").tooltip();
        }

        return {
            renderRunListTable: renderRunListTable
        };

    });

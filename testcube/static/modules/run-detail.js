define(['jquery', './table-support', 'chart-func', 'bootstrapSelect'],
    function ($, support, chart) {

        "use strict";
        let f = support.formatter;

        let runDetailColumns = [
            {title: 'ID', field: 'id'},
            {title: 'Team', field: 'team_name'},
            {title: 'Product', field: 'product_name'},
            {title: 'Name', field: 'name'},
            {title: 'Start Time', field: 'start_time', formatter: f.timeFormatter},
            {title: 'Duration', field: 'duration', formatter: f.durationFormatter},
            {title: 'Start By', field: 'start_by'},
            {title: 'Passed', field: 'result_passed'},
            {title: 'Failed', field: 'result_failed'},
            {title: 'Total', field: 'result_total'},
            {title: 'Status', field: 'get_status_display'}
        ];

        let runFailedResultColumns = [
            {title: 'ID', field: 'id', formatter: f.resultIdFormatter, sortable: true},
            {title: 'TestCase', field: 'testcase_info', formatter: f.caseNameFormatter, sortable: true},
            {title: 'Error Message', field: 'error_message', sortable: true},
            {title: 'Reason', field: 'reason', sortable: true},
            {title: 'Duration', field: 'duration', formatter: f.durationFormatter, sortable: true},
            {title: 'Outcome', field: 'get_outcome_display', formatter: f.outcomeFormatter, sortable: true}
        ];

        let runPassedResultColumns = [
            {title: 'ID', field: 'id', formatter: f.resultIdFormatter, sortable: true},
            {title: 'TestCase', field: 'testcase_info', formatter: f.caseNameFormatter, sortable: true},
            {title: 'Duration', field: 'duration', formatter: f.durationFormatter, sortable: true},
            {title: 'Assigned To', field: 'assigned_to', sortable: true},
            {title: 'Client', field: 'test_client.name', sortable: true},
            {title: 'Outcome', field: 'get_outcome_display', formatter: f.outcomeFormatter, sortable: true}
        ];

        let runHistoryColumns = [
            {title: 'ID', field: 'id', formatter: f.runIdFormatter},
            {title: 'Team', field: 'team_name'},
            {title: 'Product', field: 'product_name'},
            {title: 'Title', field: 'name'},
            {title: 'Start Time', field: 'start_time', formatter: f.timeHumanFormatter},
            {title: 'Duration', field: 'duration', formatter: f.durationFormatter},
            {title: 'Start By', field: 'start_by'},
            {
                title: 'Passing',
                field: 'passing_rate',
                formatter: f.rateFormatter
            },
            {title: 'State', field: 'get_state_display', formatter: f.runStateFormatter}
        ];

        function summaryDataHandler(data) {
            window.app.summaryInfo = data;
            return [data];
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
            window.app.runList = data;
            return data;
        }

        function runDetailPageRender(runId) {
            $('#run-summary').bootstrapTable($.extend(support.defaultTableOptions, {
                url: `/api/runs/${ runId }/info/`,
                responseHandler: summaryDataHandler,
                sidePagination: 'client',
                search: false,
                pagination: false,
                sortable: false,
                columns: runDetailColumns,
                onPostBody: runDetailSummaryPostEvent
            }));
        }

        function runDetailSummaryPostEvent(data) {
            if (data[0] === undefined) return;

            let run = data[0];
            let nav = `${run.id} - ${run.name}`;
            $('#run-nav').empty().append(nav);

            let passed = [];
            let failed = [];
            for (let result of window.app.summaryInfo.results) {
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
                columns: runFailedResultColumns,
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
                columns: runPassedResultColumns,
                onPostBody: undefined
            });

            runHistoryTableRender(run.id);
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
                columns: runHistoryColumns,
                onPostBody: chart.runDetailChartRender
            });
        }

        return {
            runDetailPageRender: runDetailPageRender,
        };

    });

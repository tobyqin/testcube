define(['jquery', './table-support', './chart-support', './utils', 'bootstrapTable', 'bootstrapSelect'],
    function ($, support, chart, utils) {

        "use strict";
        let f = support.formatter;

        let resultDetailColumns = [
            {title: 'ID', field: 'id'},
            {title: 'TestCase', field: 'testcase.name'},
            {title: 'Duration', field: 'duration', formatter: f.durationFormatter},
            {title: 'Passed Times', field: 'testcase_exec_info.passed'},
            {title: 'Failed Times', field: 'testcase_exec_info.failed'},
            {title: 'Total Execution', field: 'testcase_exec_info.total'},
            {title: 'Assigned To', field: 'assigned_to'},
            {title: 'Client', field: 'test_client.name'},
            {title: 'Outcome', field: 'get_outcome_display', formatter: f.outcomeFormatter}
        ];

        let resultHistoryColumns = [
            {title: 'ID', field: 'id', formatter: f.resultIdFormatter},
            {title: 'Run On', field: 'run_info.start_time', formatter: f.timeFormatter},
            {title: 'Duration', field: 'duration', formatter: f.durationFormatter},
            {title: 'Error Message', field: 'error_message'},
            {title: 'Reason', field: 'reason'},
            {title: 'Issue', field: 'issue_id'},
            {title: 'Client', field: 'test_client.name'},
            {title: 'Outcome', field: 'get_outcome_display', formatter: f.outcomeFormatter}
        ];

        let resultFilesColumns = [
            {title: 'Time', field: 'time', formatter: f.timeFormatter},
            {title: 'Name', field: 'url', formatter: f.imageUrlFormatter},
            {title: 'size', field: 'size'}
        ];


        function summaryDataHandler(data) {
            window.app.summaryInfo = data;
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

            $('#stderr').empty().append(stderr.trim());
            $('#stdout').empty().append(stdout.trim());
            utils.startLogHighlight();

            if (result.test_run) {
                let nav = `<a href="/runs/${result.test_run.id}">${result.test_run.id} - ${result.test_run.name}</a>`;
                $('#run-nav').empty().append(nav);
            }

            $('#result-files').bootstrapTable({
                url: `/api/results/${result.id}/files/`,
                responseHandler: resultFileTableDataHandler,
                search: false,
                pagination: false,
                sortable: false,
                showFooter: false,
                columns: resultFilesColumns
            });

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
                    columns: resultHistoryColumns,
                    onPostBody: function () {
                        chart.resultDetailChartRender();
                    }
                });
            }
        }

        function resultHistoryTableDataHandler(data) {
            window.app.resultHistory = data;
            return data.results;
        }

        function resultFileTableDataHandler(data) {
            window.app.resultFiles = data.files;
            return data.files;
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
                columns: resultDetailColumns,
                onPostBody: resultDetailSummaryPostEvent
            });
        }

        return {
            resultDetailPageRender: resultDetailPageRender
        };

    });

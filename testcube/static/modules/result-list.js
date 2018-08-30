define(['jquery', './table-support', './utils'],
    function ($, support, utils) {

        "use strict";
        let f = support.formatter;

        let resultListColumns = [
            {title: 'ID', field: 'id', formatter: f.resultIdFormatter, sortable: true},
            {title: 'TestCase', field: 'testcase_name'},
            {title: 'Error Message', field: 'error_message'},
            {title: 'Created On', field: 'created_on', formatter: f.timeFormatter},
            {title: 'Duration', field: 'duration', formatter: f.durationFormatter},
            {title: 'Outcome', field: 'get_outcome_display', formatter: f.outcomeFormatter}
        ];

        function renderResultListTable(url) {
            $('#table').bootstrapTable({
                sidePagination: 'server',
                url: url,
                responseHandler: function (data) {
                    data.total = data.count;
                    data.rows = data.results;
                    for (let row of data.rows) {
                        row.error_message = utils.safeMessage(row.error_message);
                    }
                    return data;
                },
                queryParams: support.refineQueryParams,
                search: true,
                pagination: true,
                pageSize: 20,
                pageList: [20, 50, 100],
                sortName: 'id',
                sortOrder: 'desc',
                columns: resultListColumns
            });
        }

        return {
            renderResultListTable: renderResultListTable
        };

    });

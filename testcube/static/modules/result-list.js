define(['jquery', './table-support'],
    function ($, support) {

        "use strict";
        let formatter = support.formatter;

        let resultListColumns = [
            {title: 'ID', field: 'id', formatter: formatter.resultIdFormatter, sortable: true},
            {title: 'TestCase', field: 'testcase_name'},
            {title: 'Message', field: 'error_message'},
            {title: 'Created On', field: 'created_on', formatter: formatter.timeFormatter},
            {title: 'Duration', field: 'duration', formatter: formatter.durationFormatter},
            {title: 'Outcome', field: 'get_outcome_display', formatter: formatter.outcomeFormatter}
        ];

        function resultListTableRender(url) {
            $('#table').bootstrapTable({
                sidePagination: 'server',
                url: url,
                responseHandler: function (data) {
                    data.total = data.count;
                    data.rows = data.results;
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
            resultListTableRender: resultListTableRender
        };

    });

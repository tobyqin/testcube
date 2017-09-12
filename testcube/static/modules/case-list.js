define(['jquery', './table-support', 'bootstrapSelect'],
    function ($, support) {

        "use strict";
        let f = support.formatter;

        let caseListColumns = [
            {title: 'ID', field: 'id', formatter: f.caseIdFormatter, sortable: true},
            {title: 'Team', field: 'team_name'},
            {title: 'Product', field: 'product_name'},
            {title: 'Name', field: 'name', sortable: true},
            {title: 'Priority', field: 'priority', sortable: true},
            {title: 'Owner', field: 'owner', sortable: true},
            {title: 'Updated On', field: 'updated_on', formatter: f.timeFormatter, sortable: true}
        ];

        function caseListTableRender(url) {
            $('#table').bootstrapTable({
                sidePagination: 'server',
                url: url,
                responseHandler: function (data) {
                    data.total = data.count;
                    data.rows = data.results;
                    return data;
                },
                queryParams: support.refineQueryParams,
                toolbar: '#toolbar',
                search: true,
                pagination: true,
                pageSize: 20,
                pageList: [20, 50, 100],
                sortName: 'id',
                sortOrder: 'desc',
                columns: caseListColumns,
                onPostBody: support.toolbarTablePostEvent
            });
        }

        return {
            caseListTableRender: caseListTableRender
        };

    });

define(['jquery', './table-support', 'bloodhound', 'typeahead', 'bootstrapTagsInput'],
    function ($, support, Bloodhound) {

        "use strict";
        let f = support.formatter;

        let caseDetailColumns = [
            {title: 'ID', field: 'id'},
            {title: 'Team', field: 'team_name'},
            {title: 'Product', field: 'product.name'},
            {title: 'Name', field: 'name'},
            {title: 'FullName', field: 'full_name'},
            {title: 'Keyword', field: 'keyword'},
            {title: 'Priority', field: 'priority'},
            {title: 'Description', field: 'description'},
            {title: 'Created On', field: 'created_on', formatter: f.timeFormatter},
            {title: 'Update On', field: 'updated_on', formatter: f.timeFormatter},
            {title: 'Created By', field: 'created_by'},
            {title: 'Owner', field: 'owner'}
        ];

        let caseHistoryColumns = [
            {title: 'ID', field: 'id', formatter: f.resultIdFormatter},
            {title: 'TestCase', field: 'testcase_info.name'},
            {title: 'Run On', field: 'run_info.start_time', formatter: f.timeFormatter},
            {title: 'Duration', field: 'duration', formatter: f.durationFormatter},
            {title: 'Error Message', field: 'error_message'},
            {title: 'Client', field: 'test_client.name'},
            {title: 'Outcome', field: 'get_outcome_display', formatter: f.outcomeFormatter}
        ];

        function resultHistoryTableDataHandler(data) {
            window.app.resultHistory = data;
            return data.results;
        }

        function caseDetailSummaryDataHandler(data) {
            window.app.caseInfo = data;
            return [data];
        }

        function caseDetailSummaryTablePostEvent(data) {
            if (data[0] === undefined) return;
            let testcase = data[0];
            let nav = `${testcase.id} - ${testcase.name}`;
            $('#case-nav').empty().append(nav);

            for (let tags of testcase.tags_list.split(':')) {
                $('#tc-tags').tagsinput('add', tags);
            }

            caseTagsEvent(testcase.id);
            enableTypeAhead(testcase.product.id);
            loadingCompleted();
        }

        function enableTypeAhead(productId) {
            $.getJSON('/api/products/' + productId + '/tags/', function (data) {
                let tags = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.whitespace,
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    local: data
                });

                $('input').typeahead(null, {
                    name: 'tags',
                    source: tags
                });
            });
        }

        function caseTagsEvent(id) {
            function tagsAction(event, data) {
                $.ajax({
                    url: '/api/cases/' + id + '/tags/',
                    type: 'post',
                    dataType: 'application/json',
                    data: data,
                    async: false,
                    complete: function (xhr) {
                        if (xhr.status !== 200) {
                            console.error(xhr.responseText);
                            event.cancel = true;
                            require(['bootstrap-dialog'], function (BootstrapDialog) {
                                BootstrapDialog.alert({
                                    type: BootstrapDialog.TYPE_WARNING,
                                    message: xhr.responseText
                                });
                            });
                        }
                    }
                });
            }

            let data = $('form').serialize();
            $('#tc-tags').on('beforeItemAdd', function (event) {
                let tagName = event.item;
                data += "&method=add&tags=" + tagName;
                tagsAction(event, data);

            }).on('beforeItemRemove', function (event) {
                let tagName = event.item;
                data += "&method=remove&tags=" + tagName;
                tagsAction(event, data);
            });
        }

        function caseDetailTableRender(caseId) {
            $('#case-summary').bootstrapTable({
                url: `/api/cases/${caseId}/info/`,
                responseHandler: caseDetailSummaryDataHandler,
                search: false,
                pagination: false,
                sortable: true,
                cardView: true,
                showFooter: false,
                columns: caseDetailColumns,
                onPostBody: caseDetailSummaryTablePostEvent
            });

            $('#case-history').bootstrapTable({
                sidePagination: 'client',
                url: `/api/cases/${caseId}/history/`,
                responseHandler: resultHistoryTableDataHandler,
                search: false,
                pagination: false,
                showFooter: false,
                columns: caseHistoryColumns,
                onPostBody: undefined
            });
        }

        return {
            caseDetailTableRender: caseDetailTableRender
        };

    });

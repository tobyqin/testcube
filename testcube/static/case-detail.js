define(['jquery', 'type_ahead'], function ($, Bloodhound) {

    function enableTypeAhead(productId) {
        let names = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: '/api/products/' + productId + '/tags/',
                filter: function (list) {
                    return $.map(list, function (name) {
                        return {name: name};
                    });
                }
            }
        });
        names.initialize();

        $('#tc-tags').tagsinput({
            typeaheadjs: {
                name: 'names',
                displayKey: 'name',
                valueKey: 'name',
                source: names.ttAdapter()
            }
        });
    }

    return {
        enableTypeAhead: enableTypeAhead
    };

});

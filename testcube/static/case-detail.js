define(['jquery', 'bloodhound', 'typeahead'], function ($, Bloodhound) {

    function enableTypeAhead(productId) {
        let names = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: ['dog', 'pig', 'moose'],
            // prefetch: {
            //     url: '/api/products/' + productId + '/tags/'
            // }
        });
        names.initialize();

        $('#tc-tags').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'names',
            source: names
        });
    }

    return {
        enableTypeAhead: enableTypeAhead
    };

});

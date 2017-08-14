define(['jquery', 'bloodhound', 'typeahead'], function ($, Bloodhound) {


    function enableTypeAhead(productId) {
        let tags = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: '/api/products/' + productId + '/tags/'
            }
        });

        $('input').typeahead(null, {
            name: 'tags',
            source: tags
        });
    }

    return {
        enableTypeAhead: enableTypeAhead
    };

});

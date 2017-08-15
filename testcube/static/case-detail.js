define(['jquery', 'bloodhound', 'typeahead'], function ($, Bloodhound) {

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

    return {
        enableTypeAhead: enableTypeAhead
    };

});

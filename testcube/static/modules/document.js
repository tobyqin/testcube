define(['jquery', 'marked'], function ($, marked) {
    return function () {
        $(function () {
            let contentDiv = $('#content');
            let raw = contentDiv.children().first().text().trim();
            let converted = marked(raw);
            contentDiv.attr('data-text', raw);
            contentDiv.empty().append(converted);
            loadingCompleted();
        })
    }
});

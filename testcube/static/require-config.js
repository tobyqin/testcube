requirejs.config({
    baseUrl: 'static/libs',
    shim: {
        'bootstrap': {
            deps: ['jquery', 'bootstrap_fix'],
            exports: '$.fn.popover'
        }
    },
    paths: {
        bootstrap: 'bootstrap/js/bootstrap.min',
        bootstrap_fix: 'bootstrap/js/ie10-viewport-bug-workaround',
        c3: 'c3.min',
        d3: 'd3.min',
        jquery: 'jquery-3.2.1.min',
        js_cookie: 'js.cookie-2.1.4',
        lodash: 'lodash.min',
        marked: 'marked.min',
        moment: 'moment.min',
        mustache: 'mustache.min',
    }
});

require(['bootstrap'], function () {
    console.log('bootstrap loaded.')
});

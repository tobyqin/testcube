requirejs.config({
    baseUrl: 'static/libs',
    shim: {
        'bootstrap': {
            deps: ['jquery', 'bootstrap_fix'],
            exports: '$.fn.popover'
        }
    },
    paths: {
        jquery: 'jquery-3.2.1.min',
        bootstrap: 'bootstrap/js/bootstrap.min',
        bootstrap_fix: 'bootstrap/js/ie10-viewport-bug-workaround'

    }
});

require(['bootstrap'], function () {
    console.log('load bootstrap.')
});

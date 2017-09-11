let version = '1.1';

function jsVersion(id, url) {
    return url.includes('libs/') ? '' : '?v' + version;
}
requirejs.config({
    baseUrl: '/static/',
    urlArgs: jsVersion,
    shim: {
        'bootstrap': {
            deps: ['jquery', 'bootstrap_fix'],
            exports: '$.fn.popover'
        },
        bootstrapTable: {
            deps: ['bootstrap'],
            exports: '$.fn.bootstrapTable'
        },
        bootstrapSelect: {
            deps: ['bootstrap'],
            exports: '$.fn.selectpicker'
        },
        bootstrapTagsInput: {
            deps: ['bootstrap'],
            exports: '$.fn.tagsinput'
        },
        'bootstrap-dialog': {
            deps: ['bootstrap']
        },
        'lightbox': {
            deps: ['jquery'],
            exports: '$.fn.ekkoLightbox'
        },
        bootstrapTableCookie: {
            deps: ['bootstrapTable'],
            exports: '$.fn.bootstrapTable.defaults'
        },
        typeahead: {
            deps: ['jquery'],
            init: function ($) {
                return require.s.contexts._.registry['typeahead.js'].factory($);
            }
        },
        bloodhound: {
            deps: ['jquery'],
            exports: 'Bloodhound'
        },
        rainbow: {
            exports: 'Rainbow'
        },
        rainbow_generic: {
            deps: ['rainbow']
        },
        rainbow_python: {
            deps: ['rainbow_generic']
        },
        rainbow_log: {
            deps: ['rainbow_python']
        }
    },
    paths: {
        bootstrap: 'libs/bootstrap/js/bootstrap.min',
        bootstrap_fix: 'libs/bootstrap/js/ie10-viewport-bug-workaround',
        bootstrapTable: 'libs/bootstrap-table/bootstrap-table.min',
        bootstrapSelect: 'libs/bootstrap-select/bootstrap-select.min',
        bootstrapTagsInput: 'libs/bootstrap-tagsinput/bootstrap-tagsinput.min',
        bootstrapTableCookie: 'libs/bootstrap-table/bootstrap-table-cookie',
        bootstrapTypeAhead: 'libs/bootstrap-typeahead/bootstrap3-typeahead.min',
        'bootstrap-dialog': 'libs/bootstrap-dialog/bootstrap-dialog.min',
        c3: 'libs/c3.min',
        d3: 'libs/d3.min',
        jquery: 'libs/jquery-3.2.1.min',
        'js-cookie': 'libs/js.cookie-2.1.4',
        lodash: 'libs/lodash.min',
        marked: 'libs/marked.min',
        moment: 'libs/moment.min',
        mustache: 'libs/mustache.min',
        rainbow: 'libs/rainbow/rainbow',
        rainbow_generic: 'libs/rainbow/language/generic',
        rainbow_python: 'libs/rainbow/language/python',
        rainbow_log: 'libs/rainbow/language/log',
        typeahead: 'libs/typeaheadjs/typeahead.jquery',
        bloodhound: 'libs/typeaheadjs/bloodhound',
        'lightbox': 'libs/ekko-lightbox/ekko-lightbox'
    },
    deps: ['bootstrap']
});

window.app = {};

if (!window.localStorage) {
    window.localStorage = {};
}

window.waitForLoading = function () {
    require(['jquery'], function ($) {
        $('#loading-icon').removeClass('hidden');
    })
};

window.loadingCompleted = function () {
    require(['jquery'], function ($) {
        $('#loading-icon').addClass('hidden');
    })
};


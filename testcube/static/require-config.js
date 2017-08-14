requirejs.config({
    baseUrl: '/static/libs',
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
        bootstrapTableCookie: {
            deps: ['bootstrapTable'],
            exports: '$.fn.bootstrapTable.defaults'
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
        bootstrap: 'bootstrap/js/bootstrap.min',
        bootstrap_fix: 'bootstrap/js/ie10-viewport-bug-workaround',
        bootstrapTable: 'bootstrap-table/bootstrap-table.min',
        bootstrapSelect: 'bootstrap-select/bootstrap-select.min',
        bootstrapTagsInput: 'bootstrap-tagsinput/bootstrap-tagsinput.min',
        bootstrapCookie: 'bootstrap-table/bootstrap-table-cookie',
        bootstrapTypeAhead: 'bootstrap-typeahead/bootstrap3-typeahead.min',
        c3: 'c3.min',
        d3: 'd3.min',
        jquery: 'jquery-3.2.1.min',
        'js-cookie': 'js.cookie-2.1.4',
        lodash: 'lodash.min',
        marked: 'marked.min',
        moment: 'moment.min',
        mustache: 'mustache.min',
        common: '../common',
        'table-config': '../table-config',
        'table-func': '../table-func',
        signup: '../signup',
        'chart-func': '../chart-func',
        rainbow: 'rainbow/rainbow',
        rainbow_generic: 'rainbow/language/generic',
        rainbow_python: 'rainbow/language/python',
        rainbow_log: 'rainbow/language/log',
        typeahead: 'typeaheadjs/typeahead.jquery',
        bloodhound: 'typeaheadjs/bloodhound',
        'case-detail': '../case-detail',
    },
    deps: ['bootstrap']
});

window.app = {};

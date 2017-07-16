define([], function () {

    "use strict";
    window.config = {};

    function disableConsoleLog() {
        window.config.logMethod = console.log;
        console.log = function () {
        }
    }

    function enableConsoleLog() {
        console.log = window.config.logMethod;
    }

    function getColor(value) {
        // value from 0 to 1 => red to green, if value is not good, let it red
        if (value < 0.9) {
            value -= 0.3;
        }
        let hue = (value * 120).toString(10);
        return ["hsl(", hue, ",100%,35%)"].join("");
    }

    function hmsToSeconds(str) {
        // e.g. '02:04:33' to seconds
        let p = str.split(':'),
            s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    }

    function evalInContext(js, context) {
        //# Return the results of the in-line anonymous function we .call with the passed context
        return function () {
            return eval(js);
        }.call(context);
    }

    function startLogHighlight() {
        require(['jquery', 'rainbow'], function ($, Rainbow) {
            window.Rainbow = Rainbow;
            require(['rainbow_log'], function () {
                Rainbow.color();
            });
            // let context = {'Rainbow': Rainbow};
            // $(function () {
            //     $.get('/static/libs/rainbow/language/generic.js', function (data) {
            //         evalInContext(data, context);
            //         Rainbow.color();
            //     })
            // });

            // $.get('/static/libs/rainbow/language/generic.js', function (data) {
            //     eval(data);
            //     $.get('/static/libs/rainbow/language/python.js', function (data) {
            //         eval(data);
            //         $.get('/static/libs/rainbow/language/log-zen.js', function (data) {
            //             eval(data);
            //             Rainbow.color();
            //         });
            //     });
            // });
            // require(['rainbow_log'],function () {
            //     $(function () {
            //         Rainbow.color();
            //     });
            // });

        });
        // $(function () {
        //     $.getScript('/static/libs/rainbow/rainbow.min.js', function () {
        //         $.getScript('/static/libs/rainbow/language/generic.js', function () {
        //             $.getScript('/static/libs/rainbow/language/python.js', function () {
        //                 $.getScript('/static/libs/rainbow/language/log-zen.js', function () {
        //                     Rainbow.color();
        //                     if (callback) return callback();
        //                 });
        //             });
        //         });
        //     });
        // });
    }

    return {
        'disableConsoleLog': disableConsoleLog,
        'enableConsoleLog': enableConsoleLog,
        'getColor': getColor,
        'hmsToSeconds': hmsToSeconds,
        'startLogHighlight': startLogHighlight
    };
});

define([], function () {

    "use strict";

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

    function startLogHighlight() {
        require(['jquery', 'rainbow'], function ($, Rainbow) {
            window.Rainbow = Rainbow;
            require(['rainbow_log'], function () {
                Rainbow.color();
            });
        });
    }

    return {
        'disableConsoleLog': disableConsoleLog,
        'enableConsoleLog': enableConsoleLog,
        'getColor': getColor,
        'hmsToSeconds': hmsToSeconds,
        'startLogHighlight': startLogHighlight
    };
});

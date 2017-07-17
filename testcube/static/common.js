define([], function () {

    "use strict";

    // diable console.log message
    function disableConsoleLog() {
        window.app.logMethod = console.log;
        console.log = function () {
        }
    }

    // enable console.log message
    function enableConsoleLog() {
        console.log = window.app.logMethod;
    }

    // get a color value from 0 to 1 => red to green
    // e.g. smaller value is not good, then it will be red
    function getColor(value) {
        if (value < 0.9) {
            value -= 0.3;
        }
        let hue = (value * 120).toString(10);
        return ["hsl(", hue, ",100%,35%)"].join("");
    }

    // convert hms kind of time string to seconds
    // e.g. '02:04:33' to seconds
    function hmsToSeconds(str) {
        let p = str.split(':'),
            s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    }

    // start high log output in the page
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

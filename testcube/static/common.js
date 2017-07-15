"use strict";
let my = {};
my.defaultToolTip = "Loading ...";
my.debugLog = true;

function disableConsoleLog() {
    my.logMethod = console.log;
    console.log = function () {

    }
}

function enableConsoleLog() {
    console.log = my.logMethod;
}


function doSetup() {
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

function startLogHighlight(callback) {
    $(function () {
        $.getScript('/static/libs/rainbow/rainbow.min.js', function () {
            $.getScript('/static/libs/rainbow/language/generic.js', function () {
                $.getScript('/static/libs/rainbow/language/python.js', function () {
                    $.getScript('/static/libs/rainbow/language/log-zen.js', function () {
                        Rainbow.color();
                        if (callback) callback();
                    });
                });
            });
        });
    });
}

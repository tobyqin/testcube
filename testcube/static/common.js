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

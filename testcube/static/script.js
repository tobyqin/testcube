"use strict";
let my = {};
my.defaultToolTip = "Loading ...";
my.debugLog = false;

function disableConsoleLog() {
    my.logMethod = console.log;
    console.log = () => {
    };
}

function enableConsoleLog() {
    console.log = my.logMethod;
}

"use strict";
let my = {};
my.defaultToolTip = "Loading ...";
my.debugLog = false;

function disableConsoleLog() {
    my.logMethod = console.log;
    console.log = function () {

    }
}

function enableConsoleLog() {
    console.log = my.logMethod;
}


function doSetup() {
    let $headers = $('body > h3'),
        $header = $headers.first(),
        ignoreScroll = false,
        timer;

    // Preserve in viewport when resizing browser
    $(window).on('resize', function () {
        // ignore callbacks from scroll change
        clearTimeout(timer);
        $headers.visibility('disable callbacks');

        // preserve position
        // $(document).scrollTop($header.offset().top);

        // allow callbacks in 500ms
        timer = setTimeout(function () {
            $headers.visibility('enable callbacks');
        }, 500);
    });

    $headers.visibility({
        // fire once each time passed
        once: false,

        // don't refresh position on resize
        checkOnRefresh: true,

        // lock to this element on resize
        onTopPassed: function () {
            $header = $(this);
        },
        onTopPassedReverse: function () {
            $header = $(this);
        }
    });

    $('.ui.dropdown').dropdown();
}

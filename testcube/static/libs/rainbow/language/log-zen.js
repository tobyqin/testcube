/**
 * Log output patterns for zenburnesque.css
 *
 * @author Toby Qin
 */
Rainbow.extend('log', [
    // debug level
    {
        name: 'comment',
        pattern: /([^ ]*debug).*/gi
    },

    // info level
    {
        name: 'info',
        pattern: /([^ ]*info).*/gi
    },

    // warn level
    {
        name: 'entity',
        pattern: /([^ ]*warn).*/gi
    },

    // error level
    {
        name: 'string',
        pattern: /([^ ]*error[^(]).*|([^ ]*fatal).*|([^ ]*failure).*|([^ ]*failed).*|([^ ]*exception[^(]).*/gi
    },

    // time format
    {
        name: 'comment',
        pattern: /\b([\d\-:,]+)\b/gi
    },

], 'python');

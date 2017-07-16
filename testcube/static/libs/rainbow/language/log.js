/**
 * Log output patterns for monokai.css
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
        name: 'support.tag',
        pattern: /([^ ]*info).*/gi
    },

    // warn level
    {
        name: 'string',
        pattern: /([^ ]*warn).*/gi
    },

    // error level
    {
        name: 'keyword',
        pattern: /([^ ]*error[^(]).*|([^ ]*fatal).*|([^ ]*failure).*|([^ ]*failed).*|([^ ]*exception[^(]).*/gi
    },

    // time format
    {
        name: 'comment',
        pattern: /\b([\d\-:,]+)\b/gi
    },

], 'python');

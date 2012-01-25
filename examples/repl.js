/*
 * Run this example and then:
 * - wait 1 second before starting to view 2 types of log messages
 * - connect using telnet to port 9000 on your computer
 * - type: log("module2").silence()
 *
 * You should stop seeing one of the log type messages. You can then:
 * - type: log("module2").silence(false)
 *
 * The 2 types should now appear again.
 */
var houston = require("../lib/houston"),
    log1 = houston("module1"),
    log2 = houston("module2");

houston.repl();

setInterval(function () {
	log1.info("This is module1");
}, 1200);

setInterval(function () {
	log2.warn("This is module2");
}, 1500);
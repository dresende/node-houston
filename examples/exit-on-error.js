var houston = require("../lib/houston"),
    log = houston("simple");

log.exitOnError();

log.warn("We have a problem!");

setTimeout(function () {
	log.error("This will force script to exit");
}, 1e3);
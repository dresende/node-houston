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
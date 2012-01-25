var houston = require("../lib/houston"),
    log = houston("simple");

try {
	undefinedFunction();
} catch (e) {
	log.trace(e);
}
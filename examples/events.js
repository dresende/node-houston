var log = require("../lib/houston")("simple");

log.on("log", function (type, text) {
	console.log("log - '%s' message: %s", type, text);
});
log.on("errorlog", function (type, text) {
	console.log("error log - message: %s", type, text);
});
log.warn("We have a problem!");
log.error("We have a problem!");
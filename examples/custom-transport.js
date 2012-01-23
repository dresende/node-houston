var houston = require("../lib/houston"),
    log = houston("simple");

houston.clearTransports().addTransport({
	// if this is not set, only a text string is sent to transport
	original: true,
	out: function (l) {
		console.log("[LOG (%s)] %s: %s", l.type, l.uid, l.text);
	},
	err: function (l) {
		console.log("[ERROR] %s: %s", l.uid, l.text);
	}
});
log.warn("We have a problem!");
var houston = require("../lib/houston"),
    log = houston("simple");

houston.addTransport(new houston.file({
	errors: "my-errors.log"
}));

log.error("We have a problem! Wait a sec..");

setTimeout(function () {
	log.info("Done. Check my-errors.log!");
}, 1000);
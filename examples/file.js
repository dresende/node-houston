var houston = require("../lib/houston"),
    log = houston("simple");

houston.transports.add(new houston.transports.file({
	errors: "my-errors.log"
}));

log.error("We have a problem! Wait a sec..");

setTimeout(function () {
	log.info("Done. Check my-errors.log!");
}, 1000);
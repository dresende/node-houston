var log = require("../lib/houston")("mylog");

log.info("Profiling my-test...");
log.profile("my-test");

setTimeout(function () {
	log.profile("my-test", "it worked ok!");
}, 1500);
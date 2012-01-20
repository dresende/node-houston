var houston = require("../lib/houston"),
    log = houston("simple");

log.silence("info");

log.info("We have a problem!");
log.warn("We have a problem!");
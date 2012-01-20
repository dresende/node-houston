var houston = require("../lib/houston"),
    log = houston("simple");

houston.addTransport(houston.debug());

log.warn("We have a problem!");
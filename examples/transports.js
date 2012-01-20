var houston = require("../lib/houston"),
    log = houston("simple");

houston.addTransport(new houston.debug());

log.warn("We have a problem!");
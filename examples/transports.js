var houston = require("../lib/houston"),
    log = houston("simple");

houston.transports.add(new houston.transports.debug());

log.warn("We have a problem!");
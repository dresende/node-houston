var houston = require("../lib/houston"),
    log = houston("simple");

houston.logFormat("%date | %uid (line %line): %text");

log.warn("We have a problem!");
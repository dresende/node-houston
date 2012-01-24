var houston = require("../lib/houston"),
    log = houston("simple");

houston.colorLogFormat("\033[1;33m%date | %uid (line %line): %text\033[0m", "warn");

log.warn("We have a problem!");
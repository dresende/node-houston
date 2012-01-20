var houston = require("../lib/houston"),
    log = houston("simple");

log.warn("We have a problem!");

houston.dateFormat("yyyy-mm-dd HH:MM:ss")
       .logFormat("[ %date ] %uid.%type -- %text");

log.info("We have a problem!");
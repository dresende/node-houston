var houston = require("../lib/houston"),
    log = houston("simple");

log.warn("We have a problem!");

houston.setDateFormat("yyyy-mm-dd HH:MM:ss")
       .setLogFormat("[ %date ] %uid.%type -- %text");

log.info("We have a problem!");
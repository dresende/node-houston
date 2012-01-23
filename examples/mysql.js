/*

// This is the errors log table. The normal logs
// should have another column called 'type' that
// can be an ENUM and accept 'info', 'warn', and
// 'debug'

CREATE TABLE IF NOT EXISTS `myerrors` (
  `id` bigint(10) unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uid` varchar(50) NOT NULL,
  `text` varchar(255) NOT NULL,
  `obj` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `timestamp` (`timestamp`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM DEFAULT;

*/

var houston = require("../lib/houston"),
    log = houston("mylog");

houston.transports.add(new houston.transports.mysql({
	db: { user: "myuser", password: "mypass", database: "myapp" },
	errtable: "myerrors"
}));

setInterval(function () {
	log.error("We have a problem! (stop whenever you want, check database)");
}, 1e3);
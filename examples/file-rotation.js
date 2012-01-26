var houston = require("../lib/houston"),
    log = houston("simple"),
    n = 1;

houston.transports.add(new houston.transports.file());

// send 2 messages per second to log
setInterval(function () {
	log.info("[" + (n++) + "] log message");
}, 500);


// every 5 seconds, rotate log
houston.scheduleRotate(5);
// setInterval(function () {
// 	houston.rotate();
// }, 5000);
var util = require("util"),
    Transport = require("../transport").Transport;

function TransportDebug() {
	Transport.call(this);

	this.original = true;
}
util.inherits(TransportDebug, Transport);

TransportDebug.prototype.out = function (struct, obj) {
	console.log("debug:", struct);
	if (obj) console.log(obj);
};
TransportDebug.prototype.err = function (text, obj) {
	console.log("debug:", struct);
	if (obj) console.log(obj);
};

module.exports = TransportDebug;
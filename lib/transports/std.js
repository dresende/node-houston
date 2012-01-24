var util = require("util"),
    Transport = require("../transport").Transport;

function TransportSTD() {
	Transport.call(this);
}
util.inherits(TransportSTD, Transport);

TransportSTD.prototype.out = function (text, obj) {
	process.stdout.write(text + "\n");
};
TransportSTD.prototype.err = function (text, obj) {
	process.stderr.write(text + "\n");
};
TransportSTD.prototype.colors = function (err) {
	return require("tty").isatty(err ? process.stderr : process.stdout);
};

module.exports = TransportSTD;
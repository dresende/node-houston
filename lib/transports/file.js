var util = require("util"),
    fs = require("fs"),
    Transport = require("../transport").Transport;

function TransportFile(opts) {
	Transport.call(this);

	opts || (opts = {});

	this.stdout = fs.openSync(opts.stdout || "info.log", "a");
	this.stderr = fs.openSync(opts.errors || "errors.log", "a");
}
util.inherits(TransportSTD, Transport);

TransportFile.prototype.out = function (text, obj) {
	fs.write(this.stdout, text + "\n");
};
TransportFile.prototype.err = function (text, obj) {
	fs.write(this.stderr, text + "\n");
};

module.exports = TransportFile;
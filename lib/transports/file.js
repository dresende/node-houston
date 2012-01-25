var util = require("util"),
    fs = require("fs"),
    Transport = require("../transport").Transport;

function TransportFile(opts) {
	Transport.call(this);

	opts || (opts = {});

	this.stdout = fs.createWriteStream(opts.path || "info.log", { flags: "a" });
	this.stderr = fs.createWriteStream(opts.errors || "errors.log", { flags: "a" });
}
util.inherits(TransportFile, Transport);

TransportFile.prototype.out = function (text, obj) {
	this.stdout.write(text + "\n");
};
TransportFile.prototype.err = function (text, obj) {
	this.stderr.write(text + "\n");
};

module.exports = TransportFile;
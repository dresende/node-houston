var fs = require("fs");

function Transport(opts) {
	opts || (opts = {});

	this.stdout = fs.openSync(opts.stdout || "info.log", "a");
	this.stderr = fs.openSync(opts.errors || "errors.log", "a");
}
Transport.prototype.out = function (text, obj) {
	fs.write(this.stdout, text + "\n");
};
Transport.prototype.err = function (text, obj) {
	fs.write(this.stderr, text + "\n");
};

module.exports = Transport;
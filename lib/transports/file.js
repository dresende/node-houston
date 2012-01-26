var util = require("util"),
    fs = require("fs"),
    Transport = require("../transport").Transport;

function TransportFile(opts) {
	Transport.call(this);

	opts || (opts = {});

	this.pathout = opts.path || "info.log";
	this.patherr = opts.errors || "errors.log";

	this.stdout = fs.createWriteStream(this.pathout, { flags: "a" });
	this.stderr = fs.createWriteStream(this.patherr, { flags: "a" });
	this.tmpstdout = this.tmpstderr = null;
	this.rotating = false;
	this.rotate_buffer_size = opts.rotateBufferSize || 10240; // 10K for each stream (stdout and stderr)
	this.rotate_file_suffix = opts.rotateFileSuffix || ".old";
}
util.inherits(TransportFile, Transport);

TransportFile.prototype.out = function (text) {
	if (this.tmpstdout_active) {
		this.tmpstdout.write(text + "\n", this.tmpstdout_offset, text.length + 1);
		this.tmpstdout_offset += text.length + 1;
		return;
	}
	this.stdout.write(text + "\n");
};
TransportFile.prototype.err = function (text) {
	if (this.tmpstderr_active) {
		this.tmpstderr.write(text + "\n", this.tmpstderr_offset, text.length + 1);
		this.tmpstderr_offset += text.length + 1;
		return;
	}
	this.stderr.write(text + "\n");
};
TransportFile.prototype.rotate = function () {
	if (this.rotating) return;

	var transport = this;

	this.rotating = true;

	// temporary, while the rotation doesn't finish
	this.tmpstdout = new Buffer(this.rotate_buffer_size);
	this.tmpstderr = new Buffer(this.rotate_buffer_size);
	this.tmpstdout_offset = this.tmpstderr_offset = 0;
	this.tmpstdout_active = this.tmpstderr_active = true;

	this.stdout.end();
	this.stderr.end();

	fs.rename(this.pathout, this.pathout + this.rotate_file_suffix, function (err) {
		if (err) return rollbackRotation(transport);

		fs.rename(transport.patherr, transport.patherr + transport.rotate_file_suffix, function (err) {
			return rollbackRotation(transport);
		});
	});
};

module.exports = TransportFile;

function rollbackRotation(transport) {
	// reopen files
	transport.stdout = fs.createWriteStream(transport.pathout, { flags: "a" });
	transport.stderr = fs.createWriteStream(transport.patherr, { flags: "a" });

	// write buffer
	transport.stdout.write(transport.tmpstdout.slice(0, transport.tmpstdout_offset));
	transport.stderr.write(transport.tmpstderr.slice(0, transport.tmpstderr_offset));

	// deactivate buffer
	delete transport.tmpstdout_active;
	delete transport.tmpstderr_active;

	// when a drain happens, clear buffer
	transport.stdout.once("drain", function () {
		transport.tmpstdout = null;
		if (transport.tmpstderr === null) {
			transport.rotating = false;
		}
	});
	transport.stderr.once("drain", function () {
		transport.tmpstderr = null;
		if (transport.tmpstdout === null) {
			transport.rotating = false;
		}
	});
}
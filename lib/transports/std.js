function Transport() {
	
}
Transport.prototype.out = function (text, obj) {
	process.stdout.write(text + "\n");
};
Transport.prototype.err = function (text, obj) {
	process.stderr.write(text + "\n");
};
Transport.prototype.colors = function (err) {
	return require("tty").isatty(err ? process.stderr : process.stdout);
};

module.exports = Transport;
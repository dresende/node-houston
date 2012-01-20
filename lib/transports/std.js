module.exports = {
	colors: function (err) {
		return require("tty").isatty(err ? process.stderr : process.stdout);
	},
	out: function (text) {
		process.stdout.write(text + "\n");
	},
	err: function (text) {
		process.stderr.write(text + "\n");
	}
};
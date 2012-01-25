module.exports = {
	start: function (houston, logs, port, ip) {
		var server = require("net").createServer();

		server.listen(port, ip);
		server.on("connection", function (client) {
			createContext(houston, logs, client, require("repl").start("houston> ", client).context);
		});
	}
};

function createContext(houston, logs, client, ctx) {
	for (k in houston) {
		ctx[k] = houston[k];
	}
	ctx.logs = function () {
		return Object.keys(logs);
	};
	ctx.log = function (uid) {
		return houston(uid);
	};
	ctx.exit = function () {
		client.end();
	};
}
var util = require("util"),
    events = require("events"),
    date = require("./dateformat"),
    log_uids = {},
    log_format = "%date | %uid: [%type] %text",
    debug_log_format = "%uid: %method -- %file (%line:%col)",
    colorlog_format = { info: "1;34", debug: "1;32", warn: "1;33", error: "1;31" },
    date_format = "HH:MM:ss",
    use_colors = true,
    transports = [],
    total_log_lines = 0;

function Houston(uid) {
	this.uid = uid || "default";
	this.silent = false;
	this._exitOnError = false;
	this.silent_types = [];
	this.profiles = {};

	events.EventEmitter.call(this);
}
util.inherits(Houston, events.EventEmitter);

Houston.prototype.profile = function (text, extra) {
	if (!this.profiles.hasOwnProperty(text)) {
		// I could use Date.now() but I know this will
		// not allow for older versions to work
		this.profiles[text] = (new Date()).getTime();
		return this;
	}

	var time = (new Date()).getTime() - this.profiles[text];
	delete this.profiles[text];

	this.debug(text + (extra ? " / " + extra : "") + " / duration=" + time + "ms");
};
Houston.prototype.silence = function () {
	var silent = true, type = false;

	for (var i = 0; i < arguments.length; i++) {
		switch (typeof arguments[i]) {
			case "boolean":
				silent = arguments[i];
				break;
			case "string":
				type = arguments[i];
		}
	}

	if (type === false) {
		this.silent = !(silent === false);
		return this;
	}

	if (typeof this[type] == "function") {
		if (silent === true) {
			if (this.silent_types.indexOf(type) == -1) {
				this.silent_types.push(type);
			}
		} else {
			if (this.silent_types.indexOf(type) != -1) {
				this.silent_types.splice(this.silent_types.indexOf(type), 1);
			}
		}
	}
	return this;
};
Houston.prototype.info = saveLogEntry("info");
Houston.prototype.debug = saveLogEntry("debug");
Houston.prototype.warn = saveLogEntry("warn");
Houston.prototype.error = saveLogEntry("error", true);
Houston.prototype.trace = function (e) {
	var stack = e.stack.split("\n"),
	    info = [ stack[0], [] ],
	    i = 1, j, m, dt = date.format(date_format);

	// parse
	for (; i < stack.length; i++) {
		m = stack[i].match(/at\s+(.+)\s\((.+):(\d+):(\d+)\)\s*$/i);
		if (m !== null) {
			info[1].push({
				method: m[1],
				file: m[2],
				line: parseInt(m[3], 10),
				col: parseInt(m[4], 10)
			});
		}
	}

	// format
	for (i = 0; i < info[1].length; i++) {
		info[1][i] = [
			debug_log_format.replace("%line", info[1][i].line)
			                .replace("%col", info[1][i].col)
			                .replace("%method", info[1][i].method)
			                .replace("%uid", this.uid)
			                .replace("%file", info[1][i].file)
		];
		info[1][i][1] = "\033[" + colorlog_format["debug"] + "m" + info[1][i][0] + "\033[0m";
	}
	info[0] = [
		log_format.replace("%date", dt)
		          .replace("%type", "error")
		          .replace("%uid", this.uid)
		          .replace("%text", info[0])
	];
	info[0][1] = "\033[" + colorlog_format["error"] + "m" + info[0][0] + "\033[0m";

	// deliver
	for (i = 0; i < transports.length; i++) {
		try {
			if (transports[i].original === true) {
				if (typeof transports[i].trace == "function") {
					transports[i].trace(e);
				}
				continue;
			}

			m = (use_colors && typeof transports[i].colors == "function" && transports[i].colors(true) ? 1 : 0);

			transports[i].write("err", this.uid, info[0][m]);
			for (j = 0; j < info[1].length; j++) {
				transports[i].write("err", this.uid, info[1][j][m]);
			}
		} catch (e) {}
	}
	return this;
};
Houston.prototype.exitOnError = function (ext) {
	this._exitOnError = !(ext === false);
	return this;
};

module.exports = function (uid) {
	if (!log_uids.hasOwnProperty(uid)) {
		log_uids[uid] = new Houston(uid);
	}
	return log_uids[uid];
};
module.exports.repl = function (port, ip) {
	require("./repl").start(module.exports, log_uids, port || 9000, ip || "127.0.0.1");

	return this;
};
module.exports.silence = function (silence) {
	for (uid in log_uids) {
		log_uids[uid].silence(silence);
	}
	return this;
};
module.exports.useColors = function (use) {
	if (!arguments.length) {
		return use_colors;
	}
	use_colors = (use === true);
	return this;
};
module.exports.dateFormat = function (fmt) {
	if (!arguments.length) {
		return date_format;
	}
	date_format = fmt;
	return this;
};
module.exports.logFormat = function (fmt) {
	if (!arguments.length) {
		return log_format;
	}
	log_format = fmt;
	return this;
};
module.exports.debugLogFormat = function (fmt) {
	if (!arguments.length) {
		return debug_log_format;
	}
	debug_log_format = fmt;
	return this;
};
module.exports.colorLogFormat = function (type, color) {
	if (typeof color == "undefined") {
		return colorlog_format.hasOwnProperty(type) ? colorlog_format[type] : null;
	}

	if (colorlog_format.hasOwnProperty(type) && typeof color == "string") {
		colorlog_format[type] = color;
	}
	return this;
};
module.exports.transports = function () {
	return transports;
};
module.exports.transports.add = function (transport) {
	transports.push(transport);
	return transport;
};
module.exports.transports.clear = function () {
	transports.length = 0;
	return this;
};
module.exports.rotate = function () {
	for (var i = 0; i < transports.length; i++) {
		if (typeof transports[i].rotate == "function") {
			transports[i].rotate();
		}
	}
	return this;
};
module.exports.colors = {
	      black: "0;30",
	        red: "0;31",
	      green: "0;32",
	      brown: "0;33",
	       blue: "0;34",
	     purple: "0;35",
	       cyan: "0;36",
	  lightgray: "0;37",
	   darkgray: "1;30",
	   lightred: "1;31",
	 lightgreen: "1;32",
	     yellow: "1;33",
	  lightblue: "1;34",
	lightpurple: "1;35",
	  lightcyan: "1;36",
	      white: "1;37"
};
module.exports.stats = {
	lines: function () {
		return total_log_lines;
	}
};

initTransports();

function initTransports() {
	var fs = require("fs"),
        path = require("path"),
        items = [], name = "";

	try {
		items = fs.readdirSync(__dirname + "/transports/");

		for (var i = 0; i < items.length; i++) {
			name = items[i].substr(0, items[i].length - path.extname(items[i]).length);

			try {
				module.exports.transports[name] = require("./transports/" + name);
			} catch (e) {}
		}
	} catch (e) {}

	if (typeof module.exports.transports.std == "function") {
		module.exports.transports.add(new module.exports.transports.std());
	}
}

function saveLogEntry(type, error) {
	return function () {
		if (this.silent) return this;
		if (this.silent_types.indexOf(type) != -1) return this;

		var args = Array.prototype.slice.call(arguments),
		    i = 0, l = args.length,
		    output = false, coloroutput = false,
		    text = "", obj = false, cb;

		for (; i < l; i++) {
			switch (typeof args[i]) {
				case "string":
					text = args[i];
					break;
				case "object":
					obj = args[i];
					break;
			}
		}

		if (!error) {
			this.emit("log", type, text, obj);
		} else if (this.listeners("error").length) {
			this.emit("error", type, text, obj);
		}

		total_log_lines += 1;

		for (i = 0, l = transports.length; i < l; i++) {
			try {
				if (transports[i].original === true) {
					transports[i].write(error ? "err" : "out", this.uid, {
						type: type,
						 uid: this.uid,
						text: text,
						 obj: obj
					});
					continue;
				}

				if (output === false) {
					output = log_format.replace("%date", date.format(date_format))
					                   .replace("%type", type)
					                   .replace("%uid", this.uid)
					                   .replace("%text", text);
					if (output.indexOf("%line") >= 0) {
						var line = new Error().stack.split("\n")[2].split(":")[1];
						output = output.replace("%line", line);
					}
				}

				if (use_colors && typeof transports[i].colors == "function" && transports[i].colors(error)) {
					if (coloroutput === false) {
						coloroutput = "\033[" + colorlog_format[type] + "m" + output + "\033[0m";
					}

					transports[i].write(error ? "err" : "out", this.uid, coloroutput, obj);
					continue;
				}

				transports[i].write(error ? "err" : "out", this.uid, output, obj);
			} catch (e) {}
		}

		if (type == "error" && this._exitOnError) {
			process.exit(1);
		}

		return this;
	};
}
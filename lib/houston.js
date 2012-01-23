var util = require("util"),
    events = require("events"),
    date = require("./dateformat"),
    log_uids = {},
    log_format = "%date | %uid: [%type] %text",
    colorlog_format = {
	      info: "\033[1;34m%date | %uid: %text\033[0m",
	     debug: "\033[1;32m%date | %uid: %text\033[0m",
	      warn: "\033[1;33m%date | %uid: %text\033[0m",
	     error: "\033[1;31m%date | %uid: %text\033[0m"
	},
    date_format = "HH:MM:ss",
    use_colors = true,
    transports = [];

function Houston(uid) {
	this.uid = uid || "default";
	this.silent = false;
	this.exitOnError = false;
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
Houston.prototype.exitOnError = function (ext) {
	this.exitOnError = !(ext === false);
	return this;
};

module.exports = function (uid) {
	if (!log_uids.hasOwnProperty(uid)) {
		log_uids[uid] = new Houston(uid);
	}
	return log_uids[uid];
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
module.exports.colorLogFormat = function (fmt, type) {
	if (arguments.length == 1 && colorlog_format.hasOwnProperty(fmt)) {
		return colorlog_format[fmt];
	}
	if (type) {
		colorlog_format[type] = fmt;
	} else {
		for (k in colorlog_format) {
			colorlog_format[k] = fmt;
		}
	}
	return this;
};
module.exports.transports = function () {
	return transports;
};
module.exports.transports.add = function (transport) {
	transports.push(transport);
	return this;
};
module.exports.transports.clear = function () {
	transports.length = 0;
	return this;
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

		if (this.exitOnError) {
			console.log("Process forced to exit. Details:");
			console.log("  Type: %s", type);
			console.log("   UID: %s", uid);
			console.log("  Text: %s", text);
			if (obj) {
				console.log(obj);
			}
			process.exit(1);
		}

		for (i = 0, l = transports.length; i < l; i++) {
			try {
				if (transports[i].original === true) {
					transports[i][error ? "err" : "out"]({
						type: type,
						 uid: this.uid,
						text: text,
						 obj: obj
					});
					continue;
				}

				if (use_colors && typeof transports[i].colors == "function" && transports[i].colors(error)) {
					if (coloroutput === false) {
						coloroutput = colorlog_format[type].replace("%date", date.format(date_format))
						                                   .replace("%uid", this.uid)
						                                   .replace("%text", text);
					}

					transports[i][error ? "err" : "out"](coloroutput, obj);
					continue;
				}

				if (output === false) {
					output = log_format.replace("%date", date.format(date_format))
					                   .replace("%type", type)
					                   .replace("%uid", this.uid)
					                   .replace("%text", text);
				}

				transports[i][error ? "err" : "out"](output, obj);
			} catch (e) {}
		}

		return this;
	};
}
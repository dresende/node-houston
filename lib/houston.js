var date = require("./dateformat"),
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
	this.silent_types = [];
}
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
}
Houston.prototype.info = saveLogEntry("info");
Houston.prototype.debug = saveLogEntry("debug");
Houston.prototype.warn = saveLogEntry("warn");
Houston.prototype.error = saveLogEntry("error", true);

module.exports = function (uid) {
	if (!log_uids.hasOwnProperty(uid)) {
		log_uids[uid] = new Houston(uid);
	}
	return log_uids[uid];
};
module.exports.useColors = function (use) {
	use_colors = (use === true || typeof use == "undefined");
	return this;
};
module.exports.setDateFormat = function (fmt) {
	date_format = fmt;
	return this;
};
module.exports.setLogFormat = function (fmt) {
	log_format = fmt;
	return this;
};
module.exports.setColorLogFormat = function (fmt, type) {
	if (type) {
		colorlog_format[type] = fmt;
	} else {
		for (k in colorlog_format) {
			colorlog_format[k] = fmt;
		}
	}
	return this;
};
module.exports.addTransport = function (transport) {
	transports.push(transport);
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
			module.exports[name] = (function (transport) {
				return function () {
					return {
						name: transport,
						 log: require("./transports/" + transport)
					};
				}
			})(name);
		}
	} catch (e) {}

	if (typeof module.exports.std == "function") {
		module.exports.addTransport(module.exports.std());
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

		for (i = 0, l = transports.length; i < l; i++) {
			if (transports[i].log.original === true) {
				transports[i].log[error ? "err" : "out"]({
					type: type,
					 uid: this.uid,
					text: text,
					 obj: obj
				});
				continue;
			}

			if (use_colors && typeof transports[i].log.colors == "function" && transports[i].log.colors(error)) {
				if (coloroutput === false) {
					coloroutput = colorlog_format[type].replace("%date", date.format(date_format))
					                                   .replace("%uid", this.uid)
					                                   .replace("%text", text);
				}

				transports[i].log[error ? "err" : "out"](coloroutput, obj);
				continue;
			}

			if (output === false) {
				output = log_format.replace("%date", date.format(date_format))
				                   .replace("%type", type)
				                   .replace("%uid", this.uid)
				                   .replace("%text", text);
			}

			transports[i].log[error ? "err" : "out"](output, obj);
		}

		return this;
	};
}
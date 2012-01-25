var vows = require("vows"),
    assert = require("assert"),
    houston = require("../lib/houston"),
    format1 = "",
    format2 = "";

vows.describe("houston").addBatch({
	"log_format": {
		topic: function () {
			return houston;
		},
		"should return a log format": function (topic) {
			format1 = topic.logFormat();
			assert.isString(format1);
		},
		"changing to another format": {
			topic: function () {
				houston.logFormat("another log format");
				return houston;
			},
			"should return a new format": function (topic) {
				format2 = topic.logFormat();

				assert.isString(format2);
				assert.notEqual(format1, format2);
				assert.equal(format2, "another log format");
			}
		}
	}
}).addBatch({
	"debug_log_format": {
		topic: function () {
			return houston;
		},
		"should return a log format": function (topic) {
			format1 = topic.debugLogFormat();
			assert.isString(format1);
		},
		"changing to another format": {
			topic: function () {
				houston.debugLogFormat("another debug log format");
				return houston;
			},
			"should return a new format": function (topic) {
				format2 = topic.debugLogFormat();

				assert.isString(format2);
				assert.notEqual(format1, format2);
				assert.equal(format2, "another debug log format");
			}
		}
	}
}).addBatch({
	"date_format": {
		topic: function () {
			return houston;
		},
		"should return a date format": function (topic) {
			format1 = topic.dateFormat();
			assert.isString(format1);
		},
		"changing to another format": {
			topic: function () {
				houston.dateFormat("another date format");
				return houston;
			},
			"should return a new format": function (topic) {
				format2 = topic.dateFormat();

				assert.isString(format2);
				assert.notEqual(format1, format2);
				assert.equal(format2, "another date format");
			}
		}
	}
}).addBatch({
	"color_log_format": {
		topic: function () {
			return houston;
		},
		"should return a color for a type": function (topic) {
			format1 = topic.colorLogFormat("warn");
			assert.isString(format1);
		},
		"changing to another color": {
			topic: function () {
				houston.colorLogFormat("warn", houston.colors.white);
				return houston;
			},
			"should return a new color for that type": function (topic) {
				format2 = topic.colorLogFormat("warn");

				assert.isString(format2);
				assert.notEqual(format1, format2);
				assert.equal(format2, houston.colors.white);
			},
			"should return null if no type defined": function (topic) {
				assert.isNull(topic.colorLogFormat());
			}
		}
	}
}).export(module);
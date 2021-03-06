var vows = require("vows"),
    assert = require("assert"),
    houston = require("../lib/houston"),
    Transport = require("../lib/transport").Transport;

vows.describe("houston").addBatch({
	"houston": {
		topic: function () {
			return houston;
		},
		"should have correct methods defined": function (topic) {
			assert.isFunction(topic.silence);
			assert.isFunction(topic.useColors);
			assert.isFunction(topic.dateFormat);
			assert.isFunction(topic.logFormat);
			assert.isFunction(topic.debugLogFormat);
			assert.isFunction(topic.colorLogFormat);
			assert.isFunction(topic.transports);
			assert.isFunction(topic.transports.add);
			assert.isFunction(topic.transports.clear);
		},
		"should have default std transport": function (topic) {
			assert.isFunction(topic.transports.std);
		},
		"std transport should be only and the default one": function (topic) {
			assert.equal(topic.transports().length, 1);
			assert.instanceOf(topic.transports()[0], topic.transports.std);
		}
	}
}).addBatch({
	"houston.std": {
		topic: function () {
			return new houston.transports.std();
		},
		"should be an instance of Transport": function (topic) {
			assert.instanceOf(topic, Transport);
		},
		"should have correct methods defined": function (topic) {
			assert.isFunction(topic.write);
			assert.isFunction(topic.filter);
			assert.isFunction(topic.out);
			assert.isFunction(topic.err);
		},
		"should have color checking method": function (topic) {
			assert.isFunction(topic.colors);
		}
	}
}).addBatch({
	"adding other std transport": {
		topic: function () {
			houston.transports.add(new houston.transports.std());
			return houston.transports();
		},
		"should not be a duplicate problem": function (topic) {
			assert.equal(topic.length, 2);
			assert.instanceOf(topic[0], houston.transports.std);
			assert.instanceOf(topic[1], houston.transports.std);
		}
	}
}).addBatch({
	"clearing transports": {
		topic: function () {
			houston.transports.clear();
			return houston.transports();
		},
		"should really clear the current transports": function (topic) {
			assert.isEmpty(topic);
		}
	}
}).addBatch({
	"a log": {
		topic: function () {
			return houston("log");
		},
		"should have correct methods defined": function (topic) {
			assert.isFunction(topic.info);
			assert.isFunction(topic.warn);
			assert.isFunction(topic.error);
			assert.isFunction(topic.profile);
			assert.isFunction(topic.silence);
			assert.isFunction(topic.debug);
			assert.isFunction(topic.trace);
			assert.isFunction(topic.exitOnError);
		}
	}
}).export(module);
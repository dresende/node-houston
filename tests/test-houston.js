var vows = require("vows"),
    assert = require("assert"),
    houston = require("../lib/houston");

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
			assert.isFunction(topic.colorLogFormat);
			assert.isFunction(topic.addTransport);
			assert.isFunction(topic.clearTransports);
		},
		"should have default std transport": function (topic) {
			assert.isFunction(topic.std);
		},
		"std transport should be only and the default one": function (topic) {
			assert.equal(topic.transports().length, 1);
			assert.instanceOf(topic.transports()[0], topic.std);
		}
	}
}).addBatch({
	"houston.std": {
		topic: function () {
			return new houston.std();
		},
		"should have correct methods defined": function (topic) {
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
			houston.addTransport(new houston.std());
			return houston.transports();
		},
		"should not be a duplicate problem": function (topic) {
			assert.equal(topic.length, 2);
			assert.instanceOf(topic[0], houston.std);
			assert.instanceOf(topic[1], houston.std);
		}
	}
}).addBatch({
	"clearing transports": {
		topic: function () {
			houston.clearTransports();
			return houston.transports();
		},
		"should really clear the current transports": function (topic) {
			assert.isEmpty(topic);
		}
	}
}).export(module);
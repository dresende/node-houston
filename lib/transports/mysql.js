var util = require("util"),
    mysql = require("mysql"),
    Transport = require("../transport").Transport;

function TransportDB(opts) {
	Transport.call(this);

	opts || (opts = {});
	opts.db || (opts.db = {});

	this.db = mysql.createClient(opts.db);

	this.log_out = opts.hasOwnProperty("out") ? opts.out : false;
	this.log_err = opts.hasOwnProperty("err") ? opts.err : true;

	this.table_out = opts.hasOwnProperty("outtable") ? opts.outtable : "logs";
	this.table_err = opts.hasOwnProperty("errtable") ? opts.errtable : "errors";
	this.additional_data = opts.hasOwnProperty("data") ? opts.data : {};

	this.original = true;
}
util.inherits(TransportDB, Transport);

TransportDB.prototype.out = function (struct) {
	if (!this.log_out) return;

	var data = {};
	for (k in this.additional_data) {
		data[k] = this.additional_data[k];
	}
	data.type = struct.type;
	data.uid = struct.uid;
	data.text = struct.text;
	data.obj = struct.obj ? JSON.stringify(struct.obj) : "";

	logToDatabase(this.db, this.table_out, data);
};
TransportDB.prototype.err = function (struct) {
	if (!this.log_err) return;

	var data = {};
	for (k in this.additional_data) {
		data[k] = this.additional_data[k];
	}
	data.uid = struct.uid;
	data.text = struct.text;
	data.obj = struct.obj ? JSON.stringify(struct.obj) : "";

	logToDatabase(this.db, this.table_err, data);
};

module.exports = TransportDB;

function logToDatabase(db, table, data) {
	var k = [], v = [];
	
	for (key in data) {
		k.push("`" + key + "`");
		v.push(data[key]);
	}

	db.query("INSERT INTO `" + table + "` (" + k.join(", ") + ") " +
	         "VALUES (?" + ((new Array(v.length)).join(", ?")) + ")",
	         v);
}
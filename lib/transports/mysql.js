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

	var data = buildData(this.additional_data, struct);

	logToDatabase(this.db, this.table_out, data);
};
TransportDB.prototype.err = function (struct) {
	if (!this.log_err) return;

	var data = buildData(this.additional_data, struct);
	delete data.type;

	logToDatabase(this.db, this.table_err, data);
};

module.exports = TransportDB;

function buildData(data, struct) {
	var d = {};

	for (k in data) {
		d[k] = data[k];
	}
	d.type = struct.type;
	d.uid = struct.uid;
	d.text = struct.text;
	d.obj = struct.obj ? JSON.stringify(struct.obj) : "";

	return d;
}

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
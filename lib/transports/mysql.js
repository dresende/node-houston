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

	this.original = true;
}
util.inherits(TransportSTD, Transport);

TransportDB.prototype.out = function (struct) {
	if (this.log_out) {
		logOut(this.db, this.table_out, struct);
	}
};
TransportDB.prototype.err = function (struct) {
	if (this.log_err) {
		logErr(this.db, this.table_err, struct);
	}
};

module.exports = TransportDB;

function logOut(db, table, struct) {
	db.query("INSERT INTO `"+table+"` (`type`, `uid`, `text`, `obj`) VALUES (?, ?, ?, ?)",
	         [ struct.type, struct.uid, struct.text, struct.obj ? JSON.stringify(struct.obj) : "" ]);
}
function logErr(db, table, struct) {
	db.query("INSERT INTO `"+table+"` (`uid`, `text`, `obj`) VALUES (?, ?, ?)",
	         [ struct.uid, struct.text, struct.obj ? JSON.stringify(struct.obj) : "" ]);
}
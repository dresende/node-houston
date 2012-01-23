var mysql = require("mysql");

function Transport(opts) {
	opts || (opts = {});
	opts.db || (opts.db = {});

	this.db = mysql.createClient(opts.db);

	this.log_out = opts.hasOwnProperty("out") ? opts.out : false;
	this.log_err = opts.hasOwnProperty("err") ? opts.err : true;

	this.table_out = opts.hasOwnProperty("outtable") ? opts.outtable : "logs";
	this.table_err = opts.hasOwnProperty("errtable") ? opts.errtable : "errors";

	this.original = true;
}
Transport.prototype.out = function (struct) {
	if (this.log_out) {
		logOut(this.db, this.table_out, struct);
	}
};
Transport.prototype.err = function (struct) {
	if (this.log_err) {
		logErr(this.db, this.table_err, struct);
	}
};

module.exports = Transport;

function logOut(db, table, struct) {
	db.query("INSERT INTO `"+table+"` (`type`, `uid`, `text`, `obj`) VALUES (?, ?, ?, ?)",
	         [ struct.type, struct.uid, struct.text, struct.obj ? JSON.stringify(struct.obj) : "" ]);
}
function logErr(db, table, struct) {
	db.query("INSERT INTO `"+table+"` (`uid`, `text`, `obj`) VALUES (?, ?, ?)",
	         [ struct.uid, struct.text, struct.obj ? JSON.stringify(struct.obj) : "" ]);
}
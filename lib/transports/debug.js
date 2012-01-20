function Transport() {
	this.original = true;
}
Transport.prototype.out = function (struct, obj) {
	console.log("debug:", struct);
	if (obj) console.log(obj);
};
Transport.prototype.err = function (text, obj) {
	console.log("debug:", struct);
	if (obj) console.log(obj);
};

module.exports = Transport;
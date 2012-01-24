function Transport() {
	this._filter = false;

	this.filter = function () {
		if (arguments.length == 0) {
			return;
		} else if (typeof arguments[0] == "boolean") {
			this._filter = arguments[0];
		} else {
			this._filter = Array.prototype.slice.apply(arguments);
		}
		return this;
	};
	this.write = function () {
		var args = Array.prototype.slice.apply(arguments),
		    type = args.splice(0, 1)[0],
		    uid = args.splice(0, 1)[0];

		if (this._filter === true) {
			return; // nothing passes
		}
		if (this._filter !== false && this._filter.indexOf(uid) == -1) {
			return;
		}
		this[type].apply(this, args);
	};
}
module.exports = {
	Transport: Transport
};
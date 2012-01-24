function Transport() {
	this._filter = false;

	this.filter = function () {
		if (arguments.length == 0) {
			this._filter = false;
		} else {
			this._filter = Array.prototype.slice.apply(arguments);
		}
		return this;
	};
	this.write = function () {
		var args = Array.prototype.slice.apply(arguments),
		    type = args.splice(0, 1)[0],
		    uid = args.splice(0, 1)[0];

		if (this._filter !== false) {
			if (this._filter.indexOf(uid) >= 0) {
				this[type].apply(this, args);
			}
		} else {
			this[type].apply(this, args);
		}
	};
}
module.exports = {
	Transport: Transport
};
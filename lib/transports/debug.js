module.exports = {
	original: true,
	out: function (struct, obj) {
		console.log(struct);
		if (obj) console.log(obj);
	},
	err: function (struct, obj) {
		console.log(struct);
		if (obj) console.log(obj);
	}
};
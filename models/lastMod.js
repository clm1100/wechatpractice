module.exports = exports = function lastModifiedPlugin(schema, options) {
	schema.add({
		lastMod: {
			type: Date,
			default: Date.now()
		},
		createdate: {
			type: Date,
			default: Date.now()
		}
	})

	schema.pre('save', function(next) {
		console.log("我是111插件")
		if (this.isNew) {
			this.lastMod = this.createdate = Date.now();
		} else {
			this.lastMod = Date.now();
		}
		next()
	})

	if (options && options.index) {
		schema.path('lastMod').index(options.index)
	}
}
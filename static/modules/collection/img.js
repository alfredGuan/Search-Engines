
define(function (require, exports, module) {
	var ImgModel = require('modules/model/img')
	var ImgCollection = Backbone.Collection.extend({
		model: ImgModel,
		imgId: 0,
		fetchData: function (fn) {
			var me = this;
			$.get('data/imageList.json', function (res) {
				if (res && res.errno === 0) {
					res.data.sort(function () {
						return Math.random() > .5 ? 1 : -1;
					})
					res.data.map(function (obj) {
						obj.id = me.imgId++;
					})
					me.add(res.data);
				}
				
			})
		}
	})

	module.exports = ImgCollection;
})
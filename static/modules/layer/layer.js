
define(function (require, exports, module) {
	require('modules/layer/layer.css')
	var h = $(window).height();
	var Layer = Backbone.View.extend({
		imageId: 0,
		imageList: [],
		tpl: _.template($('#tpl_layer').text()),
		events: {
			'swipeLeft .layer-container img': "showNextImage",
			'swipeRight .layer-container img': 'showPreImage',
			'tap .layer-container img': 'toggleHeader',
			// 'tap .layer .arrow-btn': 'goBack'
			'tap .layer .arrow-btn': 'goBackNew'
		},
		goBackNew: function () {
			this.imageList.pop();
			var id = this.imageList[this.imageList.length - 1];
			if (id !== undefined) {
				var model = this.collection.get(id);
				this.changeView(model);
			} else {
				location.hash = '#'
			}
		},
		toggleHeader: function () {
			this.$el.find('.layer .header').toggleClass('hide')
		},
		showPreImage: function () {
			this.imageId--;
			var model = this.collection.get(this.imageId);
			if (model) {
				this.changeView(model)
				this.imageList.push(model.get('id'))
			} else {
				alert('已经是第一张图片了');
				this.imageId++;
			}
		},
		changeView: function (model) {
			var url = model.get('url')
			this.$el.find('.layer-container img').attr('src', url)
			var title = model.get('title')
			this.$el.find('.layer .header h1').html(title)
		},
		showNextImage: function () {
			this.imageId++;
			var model = this.collection.get(this.imageId);
			if (model) {
				this.changeView(model)
				this.imageList.push(model.get('id'))
			} else {
				alert('已经是最后一张图片');
				this.imageId--;
			}
		},
		render: function (id) {
			var data = this.collection.get(id);
			if (!data) {
				location.hash = '#';
				return ;
			}
			this.imageId = data.get('id');
			this.imageList.push(this.imageId)
			var dealData = {
				url: data.get('url'),
				title: data.get('title'),
				style: 'line-height: ' + h + 'px'
			}
			var tpl = this.tpl;
			var html = tpl(dealData)
			this.$el.find('.layer').html(html)
		}
	})

	module.exports = Layer;
})

define(function (require, exports, module) {
	require('modules/list/list.css')
	var List = Backbone.View.extend({
		events: {
			'click .search span': 'showSearchView',
			'click .nav li': 'showTypeView',
			'click .go-back': 'goTop'
		},
		tpl: _.template('<a href="#layer/<%=id%>"><img src="<%=url%>" style="<%=style%>" alt="" /></a>'),
		leftHeight: 0,
		rightHeight: 0,
		initialize: function () {
			var me = this;
			this.getData();
			this.initDom();
			this.listenTo(this.collection, 'add', function (model, collection) {
				this.render(model)
			});
			$(window).on('scroll', function () {
				var h = $('body').height() - $(window).scrollTop() - $(window).height() - 200 < 0;
				if (h) {
					me.getData();
				}
				if ($(window).scrollTop() > 300) {
					me.showGoBack()
				} else {
					me.hideGoBack()
				}
			})
		},
		showGoBack: function () {
			this.$el.find('.go-back').show()
		},
		hideGoBack: function () {
			this.$el.find('.go-back').hide()
		},
		goTop: function () {
			window.scrollTo(0, 0);
		},
		getData: function () {
			this.collection.fetchData();
		},
		initDom: function () {
			this.leftContainer = this.$el.find('.left-container');
			this.rightContainer = this.$el.find('.right-container');
		},
		render: function (model) {
			var data = {
				id: model.get('id'),
				url: model.get('url'),
				style: 'width: ' + model.get('viewWidth') + 'px; height: ' + model.get('viewHeight') + 'px;'
			}
			var tpl = this.tpl;
			var html = tpl(data);
			if (this.leftHeight <= this.rightHeight) {
				this.renderLeft(model, html);
			} else {
				this.renderRight(model, html);
			}
		},
		renderLeft: function (model, html) {
			this.leftContainer.append(html);
			this.leftHeight += model.get('viewHeight') + 6;
		},
		renderRight: function (model, html) {
			this.rightContainer.append(html)
			this.rightHeight += model.get('viewHeight') + 6;
		},
		getSearchValue: function () {
			return this.$el.find('.search input').val()
		},
		checkValue: function (value) {
			if (/^\s*$/.test(value)) {
				alert('请输入搜索词');
				return false
			}
			return true;
		},
		collectionFilterByKey: function (value, key) {
			var myKey = key || 'title'
			var result = this.collection.filter(function (model) {
				if (myKey === 'type') {
					return model.get(myKey) == value;
				}
				return model.get(myKey).indexOf(value) > -1;
			})
			return result;
		},
		resetView: function (arr) {
			var me = this;
			this.clearView();
			arr.forEach(function (model) {
				me.render(model)
			})
		},
		clearView: function () {
			this.leftContainer.html('');
			this.rightContainer.html('');
			this.leftHeight = 0;
			this.rightHeight = 0;
		},
		showSearchView: function () {
			var value = this.getSearchValue();
			if (!this.checkValue(value)) {
				return ;
			};
			value = value.replace(/^\s+|\s+$/g, '')
			var result = this.collectionFilterByKey(value);
			this.resetView(result);
		},

		getDomId: function (dom) {
			return $(dom).attr('data-id')
			$(this).addClass("current").siblings().removeClass("current");
		},
		showTypeView: function (e) {

			
			var id = this.getDomId(e.target);
			var result = this.collectionFilterByKey(id, 'type')
			this.resetView(result)
	
		}

	})

	module.exports = List;

})
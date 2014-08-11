var Router = Backbone.Router.extend({
	routes: {
		'stream' : 'stream'
	},

	stream: function(){
		new Stream();
	}
})
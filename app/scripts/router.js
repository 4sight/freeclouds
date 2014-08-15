var Router = Backbone.Router.extend({
	routes: {
		'' : 'connect',
		'stream' : 'stream'
	},

	connect: function(){
		new Connect();
	},

	stream: function(){
		new Stream();
	}
})
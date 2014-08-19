var Connect = Backbone.View.extend({
  el: 'body',

  initialize: function (){
    this.render();
    },

  events: {
    'click span#disconnect' : 'connect'
  },

  render: function(){
    $('span#welcome').hide();
    $('span#disconnect').hide();
  }
});
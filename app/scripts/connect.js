var Connect = Backbone.View.extend({
  id: 'header',

  initialize: function (){
    $('span#welcome').hide();
    this.render();
    },

  render: function(){
    $('span#welcome').hide();
  }
});
(function() {
  window.Ratchet = {};

  window.App = {
    Bindings: {},
    Utils: {},
    Widgets: {},
    Views: {},
    Pages: {},
    Collections: {},
    Models: {},
    initialize: function() {
      _.setDebugLevel(2);
      this.main = new App.Views.Main({
        el: $('body')
      });
      this.main.render();
      this.router = new App.Router();
      return Backbone.history.start();
    }
  };

  $(function() {
    if (typeof AV !== "undefined" && AV !== null) {
      AV.initialize("ixeo5jke9wy1vvvl3lr06uqy528y1qtsmmgsiknxdbt2xalg", "hwud6pxjjr8s46s9vuix0o8mk0b5l8isvofomjwb5prqyyjg");
    }
    return App.initialize();
  });

}).call(this);

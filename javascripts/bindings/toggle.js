(function() {
  App.Bindings.Toggle = (function() {
    Toggle.prototype.event = "click";

    function Toggle(selector) {
      this.selector = selector;
    }

    Toggle.prototype.onSet = function($el, model, attr) {
      $el.toggleClass("active");
      return model.set(attr, $el.hasClass("active"));
    };

    return Toggle;

  })();

}).call(this);

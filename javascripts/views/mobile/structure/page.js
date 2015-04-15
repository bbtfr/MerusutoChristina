(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.Page = (function(_super) {
    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.template = _.loadTemplate("templates/mobile/page");

    Page.prototype.afterRender = function(view) {
      if (view != null) {
        if (this.view != null) {
          this.view.remove();
        }
        this.view = view;
        return this.$el.html(view.$el);
      }
    };

    Page.prototype.afterRemove = function() {
      if (this.view != null) {
        return this.view.remove();
      }
    };

    Page.prototype.show = function() {
      this.$el.addClass("sliding right");
      return _.defer((function(_this) {
        return function() {
          _this.el.offsetWidth;
          return _this.$el.removeClass("right");
        };
      })(this));
    };

    Page.prototype.hide = function() {
      return this.$el.addClass("left");
    };

    return Page;

  })(Backbone.View);

}).call(this);

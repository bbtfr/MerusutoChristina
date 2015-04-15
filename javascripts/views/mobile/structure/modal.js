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
(function() {
  var MAX_CLICK_DISTANCE, MAX_CLICK_DURATION,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MAX_CLICK_DURATION = 200;

  MAX_CLICK_DISTANCE = 5;

  App.Views.Modal = (function(_super) {
    __extends(Modal, _super);

    function Modal() {
      return Modal.__super__.constructor.apply(this, arguments);
    }

    Modal.prototype.template = void 0;

    Modal.prototype.events = {
      "touchstart": "onTouchStart",
      "touchend": "onTouchEnd",
      "mousedown": "onMouseDown",
      "mouseup": "onMouseUp"
    };

    Modal.prototype.onTouchStart = function(event) {
      return this.onMouseDown(this._imitateMouseEvent(event));
    };

    Modal.prototype.onTouchEnd = function(event) {
      return this.onMouseUp(this._imitateMouseEvent(event));
    };

    Modal.prototype._imitateMouseEvent = function(event) {
      event.pageX = event.touches[0].pageX;
      event.pageY = event.touches[0].pageY;
      return event;
    };

    Modal.prototype.onMouseDown = function(event) {
      return this.lastClick = {
        timestamp: Date.now(),
        pageX: event.pageX,
        pageY: event.pageY
      };
    };

    Modal.prototype.onMouseUp = function(event) {
      var distance, duration;
      duration = Date.now() - this.lastClick.timestamp;
      distance = Math.sqrt(Math.pow(event.pageX - this.lastClick.pageX, 2) + Math.pow(event.pageY - this.lastClick.pageY, 2));
      if (duration < MAX_CLICK_DURATION && distance < MAX_CLICK_DISTANCE) {
        event.stopPropagation();
        event.preventDefault();
        return this.hide();
      }
    };

    Modal.prototype.show = function() {
      return this.$el.addClass("active");
    };

    Modal.prototype.hide = function() {
      return this.$el.removeClass("active");
    };

    return Modal;

  })(App.Views.Page);

}).call(this);

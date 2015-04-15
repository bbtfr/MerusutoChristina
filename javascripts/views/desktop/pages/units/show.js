(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.UnitsShow = (function(_super) {
    __extends(UnitsShow, _super);

    function UnitsShow() {
      return UnitsShow.__super__.constructor.apply(this, arguments);
    }

    UnitsShow.prototype.template = _.loadTemplate("templates/desktop/pages/units/show");

    return UnitsShow;

  })(Backbone.View);

}).call(this);

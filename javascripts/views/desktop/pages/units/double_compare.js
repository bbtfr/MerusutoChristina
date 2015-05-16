(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.UnitsDoubleCompare = (function(_super) {
    __extends(UnitsDoubleCompare, _super);

    function UnitsDoubleCompare() {
      return UnitsDoubleCompare.__super__.constructor.apply(this, arguments);
    }

    UnitsDoubleCompare.prototype.template = _.loadTemplate("templates/desktop/pages/units/double_compare");

    return UnitsDoubleCompare;

  })(Backbone.View);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.MonstersShow = (function(_super) {
    __extends(MonstersShow, _super);

    function MonstersShow() {
      return MonstersShow.__super__.constructor.apply(this, arguments);
    }

    MonstersShow.prototype.template = _.loadTemplate("templates/desktop/pages/monsters/show");

    return MonstersShow;

  })(Backbone.View);

}).call(this);

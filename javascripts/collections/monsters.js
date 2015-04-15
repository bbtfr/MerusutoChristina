(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Collections.Units = (function(_super) {
    __extends(Units, _super);

    function Units() {
      return Units.__super__.constructor.apply(this, arguments);
    }

    Units.prototype.url = "../data/units.json";

    Units.prototype.model = App.Models.Unit;

    Units.prototype.initialize = function() {
      return this.comparator = function(model) {
        return -model.get("rare");
      };
    };

    return Units;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Collections.Monsters = (function(_super) {
    __extends(Monsters, _super);

    function Monsters() {
      return Monsters.__super__.constructor.apply(this, arguments);
    }

    Monsters.prototype.url = "../data/monsters.json";

    Monsters.prototype.model = App.Models.Monster;

    return Monsters;

  })(App.Collections.Units);

}).call(this);

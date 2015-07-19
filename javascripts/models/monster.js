(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Unit = (function(_super) {
    __extends(Unit, _super);

    function Unit() {
      return Unit.__super__.constructor.apply(this, arguments);
    }

    Unit.prototype.klass = "Unit";

    Unit.prototype.initialize = function(attributes, options) {
      this.origin = {
        atk: attributes.atk,
        life: attributes.life
      };
      this.setLevelMode("zero");
      this.origin.dps = this.get("dps");
      return this.origin.mdps = this.get("mdps");
    };

    Unit.prototype.calcF = function() {
      return this.f || (this.f = 1.8 + 0.1 * this.get("type"));
    };

    Unit.prototype.calcMaxLv = function(key) {
      var value;
      value = this.origin[key];
      return Math.floor(value * this.calcF());
    };

    Unit.prototype.calcMaxLvAndGrow = function(key) {
      var f, growPart, levelPart, rare, value;
      f = this.calcF();
      rare = this.get("rare");
      value = this.origin[key];
      levelPart = Math.floor(value * f);
      growPart = Math.floor(value * (f - 1) / (19 + 10 * rare)) * 5 * (rare === 1 ? 5 : 15);
      return levelPart + growPart;
    };

    Unit.prototype.calcMaxLvAndGrowDPS = function() {
      return this.calcMaxLvAndGrow("atk") / this.get("aspd");
    };

    Unit.prototype.calcMaxLvAndGrowMDPS = function() {
      return this.calcMaxLvAndGrowDPS() * this.get("anum");
    };

    Unit.prototype.setLevelMode = function(mode) {
      var atk, dps, life, mdps;
      switch (mode) {
        case "zero":
          atk = this.origin.atk;
          life = this.origin.life;
          break;
        case "mxlv":
          atk = this.calcMaxLv("atk");
          life = this.calcMaxLv("life");
          break;
        case "mxlvgr":
          atk = this.calcMaxLvAndGrow("atk");
          life = this.calcMaxLvAndGrow("life");
      }
      dps = atk / this.get("aspd");
      mdps = Math.round(dps * this.get("anum"));
      dps = Math.round(dps);
      this.set("atk", atk);
      this.set("life", life);
      this.set("dps", dps);
      return this.set("mdps", mdps);
    };

    Unit.prototype.imageUrl = function(type) {
      return "../data/units/" + type + "/" + this.id + ".png";
    };

    Unit.prototype.iconUrl = function() {
      return this.imageUrl("icon");
    };

    Unit.prototype.thumbnailUrl = function() {
      return this.imageUrl("thumbnail");
    };

    Unit.prototype.originalUrl = function() {
      return this.imageUrl("original");
    };

    Unit.prototype.getTitleString = function() {
      return "" + (this.get("title")) + " " + (this.get("name"));
    };

    Unit.prototype.getIndexString = function(strs, key) {
      return strs[this.get(key) - 1] || "暂缺";
    };

    Unit.prototype.getRareString = function() {
      return this.getIndexString(["★", "★★", "★★★", "★★★★", "★★★★★"], "rare");
    };

    Unit.prototype.getElementKey = function() {
      return this.getIndexString(["fire", "aqua", "wind", "light", "dark"], "element");
    };

    Unit.prototype.getElementString = function() {
      return this.getIndexString(["火", "水", "风", "光", "暗"], "element");
    };

    Unit.prototype.getWeaponString = function() {
      return this.getIndexString(["斩击", "突击", "打击", "弓箭", "魔法", "铳弹", "回复"], "weapon");
    };

    Unit.prototype.getTypeString = function() {
      return this.getIndexString(["早熟", "平均", "晚成"], "type");
    };

    Unit.prototype.getGenderString = function() {
      return this.getIndexString(["不明", "男", "女"], "gender");
    };

    Unit.prototype.getElementPercentString = function(element) {
      var value;
      value = this.get(element);
      if (_.isNumber(value)) {
        return "" + (Math.round(value * 100)) + "%";
      } else {
        return "暂缺";
      }
    };

    Unit.prototype.getAgeString = function() {
      var value;
      value = this.get("age");
      if (_.isNumber(value)) {
        return "" + value + "岁";
      } else {
        return "暂缺";
      }
    };

    Unit.prototype.getString = function(key) {
      return this.get(key) || "暂缺";
    };

    Unit.prototype.getFormatString = function(key) {
      return this.getString(key).replace(/ID(\d+)(\[[^\]]+\]\S+)?/g, function(text, id) {
        return "<a href=\"#units/" + id + "\">" + text + "</a>";
      });
    };

    Unit.prototype.getElementPolygonPointsString = function(l, r) {
      var c, es, ps;
      es = [this.get("fire"), this.get("aqua"), this.get("wind"), this.get("light"), this.get("dark")];
      c = {
        x: l / 2,
        y: l / 2
      };
      ps = _.map([0, 1, 2, 3, 4], function(i) {
        var a;
        a = (i * 72 - 90) * (Math.PI * 2) / 360;
        return {
          x: c.x + Math.cos(a) * r * es[i],
          y: c.y + Math.sin(a) * r * es[i]
        };
      });
      return App.Utils.SVG.getPolygonPointsString(ps);
    };

    return Unit;

  })(Backbone.Model);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Monster = (function(_super) {
    __extends(Monster, _super);

    function Monster() {
      return Monster.__super__.constructor.apply(this, arguments);
    }

    Monster.prototype.klass = "Monster";

    Monster.prototype.initialize = function(attributes, options) {
      this.origin = {
        atk: attributes.atk,
        life: attributes.life
      };
      this.setLevelMode("sm");
      this.origin.dps = this.get('dps');
      this.origin.mdps = this.get('mdps');
      return this.set("skill-sc", this.getSkillShortString());
    };

    Monster.prototype.calcBySize = function(value, size, mode) {
      switch (mode) {
        case 1:
          return Math.floor(value * Math.pow(size, 2.36));
        case 2:
          return Math.floor(value * size);
        default:
          return value;
      }
    };

    Monster.prototype.setLevelMode = function(mode) {
      var atk, dps, life, mdps;
      switch (mode) {
        case "sm":
          atk = this.origin.atk;
          life = this.origin.life;
          break;
        case "md":
          atk = this.calcBySize(this.origin.atk, 1.35, 1);
          life = this.calcBySize(this.origin.life, 1.35, 2);
          break;
        case "lg":
          atk = this.calcBySize(this.origin.atk, 1.55, 1);
          life = this.calcBySize(this.origin.life, 1.55, 2);
          break;
        case "xl":
          atk = this.calcBySize(this.origin.atk, 1.7, 1);
          life = this.calcBySize(this.origin.life, 1.7, 2);
          break;
        case "xxl":
          atk = this.calcBySize(this.origin.atk, 1.8, 1);
          life = this.calcBySize(this.origin.life, 1.8, 2);
      }
      dps = atk / this.get("aspd");
      mdps = Math.round(dps * this.get("anum"));
      dps = Math.round(dps);
      this.set("atk", atk);
      this.set("life", life);
      this.set("dps", dps);
      return this.set("mdps", mdps);
    };

    Monster.prototype.imageUrl = function(type) {
      return "../data/monsters/" + type + "/" + this.id + ".png";
    };

    Monster.prototype.getTitleString = function() {
      return this.get("name");
    };

    Monster.prototype.getSkinString = function() {
      return this.getIndexString(["坚硬", "常规", "柔软"], "skin");
    };

    Monster.prototype.getSkillShortString = function() {
      return this.get("skill").split("：")[0].split(/\s/g)[0];
    };

    return Monster;

  })(App.Models.Unit);

}).call(this);

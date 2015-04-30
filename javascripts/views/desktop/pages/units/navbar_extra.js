(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.UnitsNavbarExtra = (function(_super) {
    __extends(UnitsNavbarExtra, _super);

    function UnitsNavbarExtra() {
      return UnitsNavbarExtra.__super__.constructor.apply(this, arguments);
    }

    UnitsNavbarExtra.prototype.template = _.loadTemplate("templates/desktop/pages/units/navbar_extra");

    UnitsNavbarExtra.prototype.events = {
      "click #colvis li": "stopPropagation",
      "click .dropdown-submenu > a": "triggerHover",
      "click .filter-reset": "resetFilter",
      "click .filter": "setFilter",
      "click .level-mode": "setLevelMode",
      "click .page": "setPage",
      "change #search": "search",
      "keyup #search": "search"
    };

    UnitsNavbarExtra.prototype.afterInitialize = function(options) {
      return this.index = options["index"];
    };

    UnitsNavbarExtra.prototype.afterRender = function() {
      this.initColvis();
      return this.initDropdown();
    };

    UnitsNavbarExtra.prototype.initColvis = function() {
      var $button, $checkbox, $colvis, column, index, _i, _len, _ref, _results;
      $colvis = this.$("#colvis");
      _ref = this.index.columns;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        column = _ref[index];
        if ((column.colvis != null) && !column.colvis) {
          continue;
        }
        $button = $(this.index.$colvis._fnDomColumnButton(index));
        $checkbox = $button.find("input[type=checkbox]");
        $checkbox.attr("checked", (column.visible == null) || column.visible);
        _results.push($colvis.append($button));
      }
      return _results;
    };

    UnitsNavbarExtra.prototype.initDropdown = function() {
      var $aarea, $country, countries, country, _i, _len, _results;
      $aarea = this.$("#aarea");
      $aarea.find(".filter").each(function() {
        var $target, max, min, original;
        $target = $(this);
        original = $target.data("value").split("-");
        min = parseInt(original[0]);
        max = parseInt(original[1]);
        return $target.data("value", function(value) {
          if (min > value) {
            return false;
          }
          if (max < value) {
            return false;
          }
          return true;
        });
      });
      $country = this.$("#country");
      countries = this.index.collection.map(function(model) {
        return model.get("country");
      });
      countries = _.uniq(countries);
      _results = [];
      for (_i = 0, _len = countries.length; _i < _len; _i++) {
        country = countries[_i];
        _results.push($country.append("<li><a class=\"filter\" data-key=\"country\" data-value=\"" + country + "\">" + country + "</a></li>"));
      }
      return _results;
    };

    UnitsNavbarExtra.prototype.stopPropagation = function(event) {
      return event.stopPropagation();
    };

    UnitsNavbarExtra.prototype.triggerHover = function(event) {
      $(event.target).trigger('hover');
      return event.stopPropagation();
    };

    UnitsNavbarExtra.prototype.removeAllActive = function($target) {
      return $target.closest('.dropdown-menu').find('.active').removeClass('active');
    };

    UnitsNavbarExtra.prototype.setActive = function($target) {
      this.removeAllActive($target);
      return $target.parent('li').toggleClass("active");
    };

    UnitsNavbarExtra.prototype.resetFilter = function(event) {
      var $target, key;
      $target = $(event.target);
      this.removeAllActive($target);
      if (key = $target.data("key")) {
        delete this.index.collection.filters[key];
      } else {
        this.index.collection.filters = {};
      }
      return this.index.dataTable.draw();
    };

    UnitsNavbarExtra.prototype.setFilter = function(event) {
      var $target, key, value;
      $target = $(event.target);
      this.setActive($target);
      key = $target.data("key");
      value = $target.data("value");
      this.index.collection.filters[key] = value;
      return this.index.dataTable.draw();
    };

    UnitsNavbarExtra.prototype.setLevelMode = function(event) {
      var $target, key, model, _i, _len, _ref;
      $target = $(event.target);
      this.setActive($target);
      key = $target.data("key");
      _ref = this.index.dataTable.data();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        model.setLevelMode(key);
      }
      return this.index.dataTable.rows().invalidate().draw(false);
    };

    UnitsNavbarExtra.prototype.search = function(event) {
      var $target, query;
      $target = $(event.target);
      query = $target.val();
      return this.index.dataTable.search(query).draw();
    };

    UnitsNavbarExtra.prototype.setPage = function(event) {
      var $target, key;
      $target = $(event.target);
      this.setActive($target);
      key = $target.data("key");
      return this.index.dataTable.page.len(key).draw();
    };

    return UnitsNavbarExtra;

  })(Backbone.View);

}).call(this);

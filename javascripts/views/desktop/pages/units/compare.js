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
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.UnitsIndex = (function(_super) {
    __extends(UnitsIndex, _super);

    function UnitsIndex() {
      return UnitsIndex.__super__.constructor.apply(this, arguments);
    }

    UnitsIndex.prototype.template = _.loadTemplate("templates/desktop/pages/units/index");

    UnitsIndex.prototype.navbarExtraClass = App.Pages.UnitsNavbarExtra;

    UnitsIndex.prototype.events = {
      "click tbody tr": "openShowPage"
    };

    UnitsIndex.prototype.matchValue = function() {
      var attr, filter, filters, key, model;
      model = arguments[3];
      filters = model.collection.filters;
      for (key in filters) {
        filter = filters[key];
        attr = model.get(key);
        if (_.isFunction(filter) && filter(attr)) {
          continue;
        }
        if (_.isArray(filter) && filter.indexOf(attr) >= 0) {
          continue;
        }
        if (filter === attr) {
          continue;
        }
        return false;
      }
      return true;
    };

    UnitsIndex.prototype.openShowPage = function(event) {
      var href;
      if ($(event.target).is("a[href]")) {
        return;
      }
      this.$target = $(event.currentTarget);
      href = this.$target.find(".action-show").attr("href");
      return App.router.navigate(href, true);
    };

    UnitsIndex.prototype.initDataTableColumns = function() {
      return this.columns = [
        {
          data: null,
          colvis: false,
          orderable: false,
          render: (function(_this) {
            return function(data, type, model) {
              return "<img class='icon' src='" + (model.iconUrl()) + "' />";
            };
          })(this)
        }, {
          title: "稀有度",
          data: function(model) {
            return model.get("rare");
          },
          render: function(data, type, model) {
            return model.getRareString();
          }
        }, {
          title: "ID",
          data: function(model) {
            return model.id;
          }
        }, {
          title: "名称",
          data: function(model) {
            return model.getTitleString();
          }
        }, {
          title: "属性",
          data: function(model) {
            return model.get("element");
          },
          render: function(data, type, model) {
            return model.getElementString();
          }
        }, {
          title: "武器",
          data: function(model) {
            return model.get("weapon");
          },
          render: function(data, type, model) {
            return model.getWeaponString();
          }
        }, {
          title: "生命",
          data: function(model) {
            return model.get("life");
          }
        }, {
          title: "攻击",
          data: function(model) {
            return model.get("atk");
          }
        }, {
          title: "攻距",
          data: function(model) {
            return model.get("aarea");
          }
        }, {
          title: "攻数",
          data: function(model) {
            return model.get("anum");
          }
        }, {
          title: "攻速",
          data: function(model) {
            return model.get("aspd");
          }
        }, {
          title: "韧性",
          data: function(model) {
            return model.get("tenacity");
          }
        }, {
          title: "移速",
          data: function(model) {
            return model.get("mspd");
          }
        }, {
          title: "多段",
          data: function(model) {
            return model.get("hits");
          }
        }, {
          title: "成长",
          data: function(model) {
            return model.get("type");
          },
          render: function(data, type, model) {
            return model.getTypeString();
          },
          visible: false
        }, {
          title: "DPS",
          data: function(model) {
            return model.get("dps");
          }
        }, {
          title: "总DPS",
          data: function(model) {
            return model.get("mdps");
          }
        }, {
          title: "国家",
          data: function(model) {
            return model.get("country");
          },
          visible: false
        }, {
          title: "火",
          data: function(model) {
            return Math.round(model.get("fire") * 100);
          },
          render: function(data) {
            return data + "%";
          },
          visible: false
        }, {
          title: "水",
          data: function(model) {
            return Math.round(model.get("aqua") * 100);
          },
          render: function(data) {
            return data + "%";
          },
          visible: false
        }, {
          title: "风",
          data: function(model) {
            return Math.round(model.get("wind") * 100);
          },
          render: function(data) {
            return data + "%";
          },
          visible: false
        }, {
          title: "光",
          data: function(model) {
            return Math.round(model.get("light") * 100);
          },
          render: function(data) {
            return data + "%";
          },
          visible: false
        }, {
          title: "暗",
          data: function(model) {
            return Math.round(model.get("dark") * 100);
          },
          render: function(data) {
            return data + "%";
          },
          visible: false
        }, {
          data: null,
          colvis: false,
          orderable: false,
          render: this.renderActions
        }
      ];
    };

    UnitsIndex.prototype.renderActions = function(data, type, model) {
      return "<a class='glyphicon glyphicon-search action-show' " + ("href='#units/" + model.id + "' data-toggle='tooltip' ") + "data-placement='top' title='查看详细信息'></a>" + "<a class='glyphicon glyphicon-pencil action-edit' " + ("href='#units/" + model.id + "/edit' data-toggle='tooltip' ") + "data-placement='top' title='数据补全 / 报错'></a>" + "<a class='glyphicon glyphicon-stats action-compare' " + ("href='#units/" + model.id + "/compare' data-toggle='tooltip' ") + "data-placement='top' title='数据比较'></a>";
    };

    UnitsIndex.prototype.afterRender = function() {
      $.fn.dataTableExt.sErrMode = function() {
        return void 0;
      };
      this.initDataTable();
      this.initNavbarExtra();
      return this.$('[data-toggle="tooltip"]').tooltip();
    };

    UnitsIndex.prototype.initDataTable = function() {
      this.initDataTableColumns();
      this.collection.filters = {};
      $.fn.dataTableExt.afnFiltering.push(this.matchValue);
      this.$dataTable = this.$("table").dataTable({
        autoWidth: false,
        columns: this.columns,
        data: this.collection.models,
        displayLength: 50,
        dom: "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-6'i><'col-sm-6'p>>",
        order: [[1, 'desc']],
        language: {
          processing: "处理中...",
          lengthMenu: "显示 _MENU_ 项结果",
          zeroRecords: "没有匹配结果",
          info: "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
          infoEmpty: "显示第 0 至 0 项结果，共 0 项",
          infoFiltered: "(由 _MAX_ 项结果过滤)",
          infoPostFix: "",
          search: "搜索:",
          url: "",
          paginate: {
            first: "首页",
            previous: "上页",
            next: "下页",
            last: "末页"
          }
        }
      });
      return this.dataTable = this.$dataTable.api();
    };

    UnitsIndex.prototype.pause = function() {
      this.scrollTop = $(window).scrollTop();
      return this.navbarExtra.$el.hide();
    };

    UnitsIndex.prototype.resume = function() {
      _.defer((function(_this) {
        return function() {
          $(window).scrollTop(_this.scrollTop);
          if (_this.$target) {
            return _this.$target.pulse({
              opacity: 0.5
            }, {
              duration: 500,
              pulses: 3
            });
          }
        };
      })(this));
      return this.navbarExtra.$el.show();
    };

    UnitsIndex.prototype.initNavbarExtra = function() {
      this.$colvis = new $.fn.dataTable.ColVis(this.$dataTable);
      this.navbarExtra = new this.navbarExtraClass({
        index: this
      });
      return $("#navbar-extra").html(this.navbarExtra.render().$el);
    };

    UnitsIndex.prototype.afterRemove = function() {
      $.fn.dataTableExt.afnFiltering.pop();
      return this.navbarExtra.remove();
    };

    return UnitsIndex;

  })(Backbone.View);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.UnitsCompare = (function(_super) {
    __extends(UnitsCompare, _super);

    function UnitsCompare() {
      this.renderActions = __bind(this.renderActions, this);
      return UnitsCompare.__super__.constructor.apply(this, arguments);
    }

    UnitsCompare.prototype.template = _.loadTemplate("templates/desktop/pages/units/compare");

    UnitsCompare.prototype.renderActions = function(data, type, model) {
      return "<a class='glyphicon glyphicon-stats action-compare' " + ("href='#units/" + this.model.id + "/compare/" + model.id + "' data-toggle='tooltip' ") + "data-placement='top' title='数据比较'></a>";
    };

    UnitsCompare.prototype.openShowPage = function(event) {
      var href;
      if ($(event.target).is("a[href]")) {
        return;
      }
      this.$target = $(event.currentTarget);
      href = this.$target.find(".action-compare").attr("href");
      return App.router.navigate(href, true);
    };

    return UnitsCompare;

  })(App.Pages.UnitsIndex);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.Admin = (function(_super) {
    __extends(Admin, _super);

    function Admin() {
      return Admin.__super__.constructor.apply(this, arguments);
    }

    Admin.prototype.template = _.loadTemplate("templates/desktop/pages/admin/index");

    Admin.prototype.events = {
      "click .action-accept": "accept",
      "click .action-reject": "reject"
    };

    Admin.prototype.setState = function(event, state) {
      var data, id, model, _i, _len, _ref;
      id = $(event.target).data("model-id");
      _ref = this.dataTable.data();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.id === id) {
          model = data;
        }
      }
      model.set("state", state);
      return model.save({
        success: (function(_this) {
          return function() {
            return _this.dataTable.rows().invalidate().draw();
          };
        })(this)
      });
    };

    Admin.prototype.accept = function(event) {
      return this.setState(event, 1);
    };

    Admin.prototype.reject = function(event) {
      return this.setState(event, 2);
    };

    Admin.prototype.afterRender = function() {
      var query;
      query = new AV.Query("Suggestion").descending("createdAt").limit(1000);
      query.find({
        success: (function(_this) {
          return function(models) {
            _this.models = models;
            _this.initDataTable();
            _this.initNavbarExtra();
            return _this.$('[data-toggle="tooltip"]').tooltip();
          };
        })(this)
      });
      return this.columns = [
        {
          title: "ID",
          data: function(model) {
            return model.get("model") || {};
          },
          render: function(data) {
            return "" + data.klass + "/" + data.id + " " + data.name;
          }
        }, {
          title: "修改",
          data: function(model) {
            return model.get("data") || {};
          },
          render: function(data) {
            var $changelog, d, _i, _len;
            $changelog = $("<ul></ul>");
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              d = data[_i];
              $changelog.append("<li>" + App.KeyMap[d.name] + "： " + d.from + " => " + d.to + "</li>");
            }
            return $changelog.html();
          }
        }, {
          title: "数据提供者",
          data: function(model) {
            return model.get("contributor") || {};
          },
          render: function(data) {
            if ((data.nickname != null) && data.nickname !== "" && (data.contact != null) && data.contact !== "") {
              return "" + data.nickname + "(" + data.contact + ")";
            } else {
              return data.nickname || data.contact || "匿名";
            }
          }
        }, {
          title: "提交时间",
          data: function(model) {
            return model.createdAt;
          },
          render: function(data) {
            return (typeof data.toLocaleDateString === "function" ? data.toLocaleDateString() : void 0) || data.toDateString();
          }
        }, {
          title: "状态",
          data: function(model) {
            return model.get("state") || 0;
          },
          render: function(data) {
            return ["等待审核", "审核通过", "审核拒绝", "数据已合并", "数据已作废"][data];
          }
        }, {
          data: null,
          orderable: false,
          render: (function(_this) {
            return function(data, type, model) {
              if (model.get("state") === 3 || model.get("state") === 4) {
                return "";
              }
              return ("<a class='glyphicon glyphicon-ok action-accept' data-model-id='" + model.id + "'") + "data-toggle='tooltip' data-placement='top' title='审核通过'></a>" + ("<a class='glyphicon glyphicon-remove action-reject'  data-model-id='" + model.id + "'") + "data-toggle='tooltip' data-placement='top' title='审核拒绝'></a>";
            };
          })(this)
        }
      ];
    };

    Admin.prototype.initDataTable = function() {
      this.$dataTable = this.$("table").dataTable({
        autoWidth: false,
        columns: this.columns,
        data: this.models,
        displayLength: 50,
        dom: "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-6'i><'col-sm-6'p>>",
        order: [[3, 'desc']],
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

    Admin.prototype.initNavbarExtra = function() {
      this.navbarExtra = new App.Pages.AdminNavbarExtra({
        index: this
      });
      return $("#navbar-extra").html(this.navbarExtra.render().$el);
    };

    Admin.prototype.resume = function() {
      return void 0;
    };

    return Admin;

  })(Backbone.View);

}).call(this);

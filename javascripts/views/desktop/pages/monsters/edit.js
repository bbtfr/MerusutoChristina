(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.UnitsEdit = (function(_super) {
    __extends(UnitsEdit, _super);

    function UnitsEdit() {
      return UnitsEdit.__super__.constructor.apply(this, arguments);
    }

    UnitsEdit.prototype.template = _.loadTemplate("templates/desktop/pages/units/edit");

    UnitsEdit.prototype.events = {
      "submit form": "submitForm",
      "click #confirm-button": "confirmSubmitForm"
    };

    UnitsEdit.prototype.afterRender = function() {
      var query;
      query = new AV.Query("Suggestion");
      query.equalTo("state", null);
      query.equalTo("model.klass", this.model.klass);
      query.equalTo("model.id", this.model.id);
      return query.count({
        success: (function(_this) {
          return function(count) {
            if (count > 0) {
              return _this.$("#editing-warning").show();
            }
          };
        })(this)
      });
    };

    UnitsEdit.prototype.formatValue = function(data) {
      var value, _ref;
      value = data.value;
      if (((_ref = data.name) === "fire" || _ref === "aqua" || _ref === "wind" || _ref === "light" || _ref === "dark") && value > 10) {
        value /= 100;
      }
      return value;
    };

    UnitsEdit.prototype.matchValue = function(data, value) {
      if (data.value == null) {
        return false;
      }
      if (data.value === "") {
        return false;
      }
      if (_.isNumber(value)) {
        return parseFloat(data.value) !== value;
      } else {
        return data.value.replace("\r\n", "\n") !== value;
      }
    };

    UnitsEdit.prototype.submitForm = function(event) {
      var $changelog, data, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      event.preventDefault();
      this.rawData = {};
      this.changedData = [];
      _ref = this.$("form").serializeArray();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        this.rawData[data.name] = data.value;
        if ((_ref1 = data.name) === "nickname" || _ref1 === "contact") {
          continue;
        }
        value = this.model.get(data.name);
        if (this.matchValue(data, value)) {
          this.changedData.push({
            name: data.name,
            from: value || "暂缺",
            to: this.formatValue(data)
          });
        }
      }
      if (this.changedData.length > 0) {
        $changelog = this.$("#changelog").empty();
        _ref2 = this.changedData;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          data = _ref2[_j];
          $changelog.append("<li>" + App.KeyMap[data.name] + "： " + data.from + " => " + data.to + "</li>");
        }
        return this.$confirmModal = this.$("#confirm-modal").modal();
      } else {
        return App.main.openInfoModal("提交数据", "<p>您没有修改任何数据！</p>");
      }
    };

    UnitsEdit.prototype.confirmSubmitForm = function() {
      var suggestion;
      this.$confirmModal.modal("hide");
      suggestion = AV.Object["new"]("Suggestion");
      suggestion.set("model", {
        klass: this.model.klass,
        id: this.model.id,
        name: this.model.getTitleString()
      });
      suggestion.set("contributor", {
        nickname: this.rawData["nickname"],
        contact: this.rawData["contact"]
      });
      suggestion.set("data", this.changedData);
      return suggestion.save({
        success: function() {
          return App.main.openInfoModal("提交数据", "<p>您提交的数据已被记录，等待管理员审核中...</p>\n<p>\n  您提交的数据在被管理员审核后，将会更新到图鉴中；<br>\n  同时您的昵称也将会加入图鉴数据提供者名单，感谢您对图鉴的热情与贡献！\n</p>");
        },
        error: function() {
          return App.main.openInfoModal("提交数据", "<p>网络错误，请稍候再试...</p>");
        }
      });
    };

    return UnitsEdit;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.MonstersEdit = (function(_super) {
    __extends(MonstersEdit, _super);

    function MonstersEdit() {
      return MonstersEdit.__super__.constructor.apply(this, arguments);
    }

    MonstersEdit.prototype.template = _.loadTemplate("templates/desktop/pages/monsters/edit");

    MonstersEdit.prototype.events = _.extend(App.Pages.UnitsEdit.prototype.events, {
      "click .calculator": "showCalculatorModal",
      "keyup #calculator-modal input[type=number]": "calculateSize",
      "change #calculator-modal input[type=number]": "calculateSize",
      "click #insert-button": "insertForm"
    });

    MonstersEdit.prototype.showCalculatorModal = function() {
      return this.$calculatorModal = this.$("#calculator-modal").modal();
    };

    MonstersEdit.prototype.calculateSize = function() {
      var atk, life, size;
      size = this.$("#csize").val();
      life = this.$("#clife").val();
      atk = this.$("#catk").val();
      this.$("#rlife").val(Math.round(life / size));
      return this.$("#ratk").val(Math.round(atk / Math.pow(size, 2.36)));
    };

    MonstersEdit.prototype.insertForm = function(event) {
      event.preventDefault();
      this.$("#life").val(this.$("#rlife").val());
      this.$("#atk").val(this.$("#ratk").val());
      return this.$calculatorModal.modal("hide");
    };

    return MonstersEdit;

  })(App.Pages.UnitsEdit);

}).call(this);

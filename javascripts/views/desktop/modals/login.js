(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.LoginModal = (function(_super) {
    __extends(LoginModal, _super);

    function LoginModal() {
      return LoginModal.__super__.constructor.apply(this, arguments);
    }

    LoginModal.prototype.template = _.loadTemplate("templates/desktop/modals/login");

    LoginModal.prototype.events = {
      "submit form": "submitForm"
    };

    LoginModal.prototype.submitForm = function(event) {
      var password, username;
      event.preventDefault();
      username = this.$("#username").val();
      password = this.$("#password").val();
      return AV.User.logIn(username, password, {
        success: (function(_this) {
          return function() {
            App.main.closeModal();
            return typeof _this.callback === "function" ? _this.callback() : void 0;
          };
        })(this),
        error: function() {
          return App.main.openInfoModal("用户登录", "<p>用户名或密码错误！</p>");
        }
      });
    };

    LoginModal.prototype.afterRender = function(callback) {
      return this.callback = callback;
    };

    return LoginModal;

  })(Backbone.View);

}).call(this);

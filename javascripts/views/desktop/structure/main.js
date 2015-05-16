(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.Page = (function(_super) {
    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.afterRender = function(view) {
      if (view != null) {
        if (this.view != null) {
          this.view.remove();
        }
        this.view = view;
        return this.$el.html(view.$el || view);
      }
    };

    Page.prototype.afterRemove = function() {
      if (this.view != null) {
        return this.view.remove();
      }
    };

    return Page;

  })(Backbone.View);

}).call(this);
(function() {
  var MAX_CLICK_DISTANCE, MAX_CLICK_DURATION,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MAX_CLICK_DURATION = 200;

  MAX_CLICK_DISTANCE = 5;

  App.Views.Modal = (function(_super) {
    __extends(Modal, _super);

    function Modal() {
      return Modal.__super__.constructor.apply(this, arguments);
    }

    Modal.prototype.show = function() {
      return this.$el.modal("show");
    };

    Modal.prototype.hide = function() {
      return this.$el.modal("hide");
    };

    return Modal;

  })(App.Views.Page);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.Main = (function(_super) {
    __extends(Main, _super);

    function Main() {
      return Main.__super__.constructor.apply(this, arguments);
    }

    Main.prototype.template = _.loadTemplate("templates/desktop/main");

    Main.prototype.navbar_links_template = _.loadTemplate("templates/desktop/navbar_links");

    Main.prototype.layout = {
      "#collectionView": App.Views.Page,
      "#modelView": App.Views.Page,
      "modal": App.Views.Modal
    };

    Main.prototype.events = {
      "click a[sref]": "loadState",
      "click .action-login": "openLoginModal",
      "click .action-logout": "logout"
    };

    Main.prototype.logout = function() {
      return AV.User.logOut();
    };

    Main.prototype.loadState = function(event) {
      var url;
      url = $(event.currentTarget).attr("sref");
      Backbone.history.loadUrl(url);
      return event.preventDefault();
    };

    Main.prototype.openModal = function(view) {
      return this.views["modal"].render(view).show();
    };

    Main.prototype.openInfoModal = function(title, info) {
      this.infoModal || (this.infoModal = new App.Pages.InfoModal());
      this.infoModal.render(title, info);
      return this.views["modal"].render(this.infoModal).show();
    };

    Main.prototype.openLoginModal = function(callback) {
      this.loginModal || (this.loginModal = new App.Pages.LoginModal());
      this.loginModal.render(callback);
      return this.views["modal"].render(this.loginModal).show();
    };

    Main.prototype.closeModal = function() {
      return this.views["modal"].hide();
    };

    Main.prototype.pauseCollectionPage = function() {
      var _ref;
      this.views["#modelView"].$el.show();
      this.views["#collectionView"].$el.hide();
      if ((_ref = this.views["#collectionView"].view) != null) {
        if (typeof _ref.pause === "function") {
          _ref.pause();
        }
      }
      return this.$("#navbar-links").html(this.navbar_links_template());
    };

    Main.prototype.resumeCollectionPage = function() {
      var _base;
      this.views["#modelView"].$el.hide();
      this.views["#collectionView"].$el.show();
      if (typeof (_base = this.views["#collectionView"].view).resume === "function") {
        _base.resume();
      }
      return this.$("#navbar-links").html(this.navbar_links_template());
    };

    Main.prototype.openModelPage = function(view) {
      this.$el.scrollTop(0);
      this.views["#modelView"].render(view);
      return this.pauseCollectionPage();
    };

    Main.prototype.openCollectionPage = function(view) {
      this.views["#collectionView"].render(view);
      return this.resumeCollectionPage();
    };

    return Main;

  })(Backbone.View);

}).call(this);

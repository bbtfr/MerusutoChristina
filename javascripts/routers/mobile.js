(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      "toggle-sidebar": "toggleSidebar",
      "close-modal": "closeModal",
      "units": "openUnitsIndexPage",
      "units/:id": "openUnitsShowPage",
      "monsters": "openMonstersIndexPage",
      "monsters/:id": "openMonstersShowPage",
      "!*otherwise": "removeExclamationMark",
      "*otherwise": "index"
    };

    Router.prototype.toggleSidebar = function() {
      return App.main.toggleSidebar();
    };

    Router.prototype.closeModal = function() {
      return App.main.closeModal();
    };

    Router.prototype.index = function() {
      return this.navigate("#units", true);
    };

    Router.prototype.removeExclamationMark = function(path) {
      return this.navigate(path, true);
    };

    Router.prototype.openCollectionPage = function(key, collection, page) {
      var view;
      if (App[key] == null) {
        App[key] = new App.Collections[collection]();
        App[key].fetch({
          reset: true
        });
      }
      view = new App.Pages[page]({
        collection: App[key]
      });
      App.main.openPage(view.render());
      return this.track();
    };

    Router.prototype.openModelPage = function(key, collection, page, id) {
      var model, view;
      if (App[key] == null) {
        return this.navigate("#" + key, true);
      }
      model = App[key].get(id);
      view = new App.Pages[page]({
        model: model
      });
      App.main.openModal(view.render());
      return this.track();
    };

    Router.prototype.openUnitsIndexPage = function() {
      return this.openCollectionPage("units", "Units", "UnitsIndex");
    };

    Router.prototype.openUnitsShowPage = function(id) {
      return this.openModelPage("units", "Units", "UnitsShow", id);
    };

    Router.prototype.openMonstersIndexPage = function() {
      return this.openCollectionPage("monsters", "Monsters", "MonstersIndex");
    };

    Router.prototype.openMonstersShowPage = function(id) {
      return this.openModelPage("monsters", "Monsters", "MonstersShow", id);
    };

    Router.prototype.track = function() {
      var url;
      if (typeof ga !== "undefined" && ga !== null) {
        url = Backbone.history.getFragment();
        if (!/^\//.test(url)) {
          url = '/' + url;
        }
        return ga('send', {
          hitType: 'pageview',
          page: url
        });
      }
    };

    return Router;

  })(Backbone.Router);

}).call(this);

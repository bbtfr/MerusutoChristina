(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      "close-modal": "closeModal",
      "units": "openUnitsIndexPage",
      "units/:id": "openUnitsShowPage",
      "units/:id/edit": "openUnitsEditPage",
      "units/:id/compare": "openUnitsComparePage",
      "units/:id1/compare/:id2": "openUnitsDoubleComparePage",
      "monsters": "openMonstersIndexPage",
      "monsters/:id": "openMonstersShowPage",
      "monsters/:id/edit": "openMonstersEditPage",
      "monsters/:id/compare": "openMonstersComparePage",
      "monsters/:id1/compare/:id2": "openMonstersDoubleComparePage",
      "admin": "openAdminPage",
      "!*otherwise": "removeExclamationMark",
      "*otherwise": "index"
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

    Router.prototype.ensureCollection = function(key, collection, callback) {
      if (App[key] != null) {
        return callback();
      } else {
        App[key] = new App.Collections[collection]();
        App[key].fetch({
          reset: true
        });
        return App[key].once("reset", function() {
          return callback();
        });
      }
    };

    Router.prototype.openCollectionPage = function(key, collection, page) {
      if (this.currCollection === collection) {
        App.main.resumeCollectionPage();
      } else {
        this.ensureCollection(key, collection, (function(_this) {
          return function() {
            var view;
            view = new App.Pages[page]({
              collection: App[key]
            }).render();
            App.main.openCollectionPage(view);
            return _this.currCollection = collection;
          };
        })(this));
      }
      return this.track();
    };

    Router.prototype.openModelPage = function(key, collection, page, id) {
      this.ensureCollection(key, collection, function() {
        var model, view;
        model = App[key].get(id);
        view = new App.Pages[page]({
          model: model,
          collection: App[key]
        }).render();
        return App.main.openModelPage(view);
      });
      return this.track();
    };

    Router.prototype.openDoubleModelPage = function(key, collection, page, id1, id2) {
      this.ensureCollection(key, collection, function() {
        var models, view;
        models = [];
        models.push(App[key].get(id2));
        models.push(App[key].get(id1));
        view = new App.Pages[page]({
          collection: models
        }).render();
        return App.main.openModelPage(view);
      });
      return this.track();
    };

    Router.prototype.openAdminPage = function() {
      var view;
      this.currCollection = null;
      if (AV.User.current()) {
        view = new App.Pages.Admin().render();
        App.main.openCollectionPage(view);
      } else {
        App.main.openLoginModal(this.openAdminPage);
      }
      return this.track();
    };

    Router.prototype.openUnitsIndexPage = function() {
      return this.openCollectionPage("units", "Units", "UnitsIndex");
    };

    Router.prototype.openUnitsShowPage = function(id) {
      return this.openModelPage("units", "Units", "UnitsShow", id);
    };

    Router.prototype.openUnitsEditPage = function(id) {
      return this.openModelPage("units", "Units", "UnitsEdit", id);
    };

    Router.prototype.openUnitsComparePage = function(id) {
      return this.openModelPage("units", "Units", "UnitsCompare", id);
    };

    Router.prototype.openUnitsDoubleComparePage = function(id1, id2) {
      return this.openDoubleModelPage("units", "Units", "UnitsDoubleCompare", id1, id2);
    };

    Router.prototype.openMonstersIndexPage = function() {
      return this.openCollectionPage("monsters", "Monsters", "MonstersIndex");
    };

    Router.prototype.openMonstersShowPage = function(id) {
      return this.openModelPage("monsters", "Monsters", "MonstersShow", id);
    };

    Router.prototype.openMonstersEditPage = function(id) {
      return this.openModelPage("monsters", "Monsters", "MonstersEdit", id);
    };

    Router.prototype.openMonstersComparePage = function(id) {
      return this.openModelPage("monsters", "Monsters", "MonstersCompare", id);
    };

    Router.prototype.openMonstersDoubleComparePage = function(id1, id2) {
      return this.openDoubleModelPage("monsters", "Monsters", "MonstersDoubleCompare", id1, id2);
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

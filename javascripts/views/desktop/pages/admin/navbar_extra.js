(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.AdminNavbarExtra = (function(_super) {
    __extends(AdminNavbarExtra, _super);

    function AdminNavbarExtra() {
      return AdminNavbarExtra.__super__.constructor.apply(this, arguments);
    }

    AdminNavbarExtra.prototype.template = _.loadTemplate("templates/desktop/pages/admin/navbar_extra");

    AdminNavbarExtra.prototype.events = {
      "click .dropdown-submenu > a": "triggerHover",
      "click .state": "setState",
      "click .page": "setPage",
      "change #search": "search",
      "keyup #search": "search"
    };

    AdminNavbarExtra.prototype.afterInitialize = function(options) {
      return this.index = options["index"];
    };

    AdminNavbarExtra.prototype.triggerHover = function(event) {
      $(event.target).trigger('hover');
      return event.stopPropagation();
    };

    AdminNavbarExtra.prototype.removeAllActive = function($target) {
      return $target.closest('.dropdown-menu').find('.active').removeClass('active');
    };

    AdminNavbarExtra.prototype.setActive = function($target) {
      this.removeAllActive($target);
      return $target.parent('li').toggleClass("active");
    };

    AdminNavbarExtra.prototype.setState = function(event) {
      var $target, key;
      $target = $(event.target);
      this.setActive($target);
      key = $target.data("key");
      return this.index.dataTable.column(-2).search(key).draw();
    };

    AdminNavbarExtra.prototype.search = function(event) {
      var $target, query;
      $target = $(event.target);
      query = $target.val();
      return this.index.dataTable.search(query).draw();
    };

    AdminNavbarExtra.prototype.setPage = function(event) {
      var $target, key;
      $target = $(event.target);
      this.setActive($target);
      key = $target.data("key");
      return this.index.dataTable.page.len(key).draw();
    };

    return AdminNavbarExtra;

  })(Backbone.View);

}).call(this);

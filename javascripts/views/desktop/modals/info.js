(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.InfoModal = (function(_super) {
    __extends(InfoModal, _super);

    function InfoModal() {
      return InfoModal.__super__.constructor.apply(this, arguments);
    }

    InfoModal.prototype.template = _.loadTemplate("templates/desktop/modals/info");

    InfoModal.prototype.afterRender = function(title, info) {
      this.$("#modal-title").html(title);
      return this.$("#modal-body").html(info);
    };

    return InfoModal;

  })(Backbone.View);

}).call(this);

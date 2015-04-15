(function() {
  App.Utils.SVG = {
    getPolygonPointsString: function(ps) {
      return _.map(ps, function(p) {
        return "" + p.x + "," + p.y;
      }).join(" ");
    },
    getBackgroundPolygonPointsString: function(l, r) {
      var c, ps;
      if (this.bgs && (this.bgs[r] != null)) {
        return this.bgs[r];
      }
      c = {
        x: l / 2,
        y: l / 2
      };
      ps = _.map([0, 1, 2, 3, 4], function(i) {
        var a;
        a = (i * 72 - 90) * (Math.PI * 2) / 360;
        return {
          x: c.x + Math.cos(a) * r,
          y: c.y + Math.sin(a) * r
        };
      });
      if (!this.bgs) {
        this.bgs = {};
      }
      return this.bgs[r] = App.Utils.SVG.getPolygonPointsString(ps);
    }
  };

}).call(this);

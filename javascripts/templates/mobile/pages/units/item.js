(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/pages/units/item"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        var key;
      
        __out.push('<li class="table-view-cell media unit">\n  <a href="#units/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('">\n    <img class="media-object pull-left" src="');
      
        __out.push(__sanitize(this.model.thumbnailUrl()));
      
        __out.push('">\n    <svg class="media-graphics element pull-right" width="80" height="80">\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(App.Utils.SVG.getBackgroundPolygonPointsString(80, 40)));
      
        __out.push('" class="element-background"/>\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(App.Utils.SVG.getBackgroundPolygonPointsString(80, 26.7)));
      
        __out.push('" class="element-background"/>\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(App.Utils.SVG.getBackgroundPolygonPointsString(80, 13.3)));
      
        __out.push('" class="element-background"/>\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(this.model.getElementPolygonPointsString(80, 20)));
      
        __out.push('" class="');
      
        if (key = this.model.getElementKey()) {
          __out.push(__sanitize("element-" + key));
        }
      
        __out.push('"/>\n    </svg>\n    <div class="media-body">\n      <h4 class="media-title">\n        ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n        <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n      </h4>\n      <div class="media-info-group">\n        <p class="media-info">\n          生命：<span id="life">');
      
        __out.push(__sanitize(this.model.get("life")));
      
        __out.push('</span><br>\n          攻击：<span id="atk">');
      
        __out.push(__sanitize(this.model.get("atk")));
      
        __out.push('</span><br>\n          攻距：');
      
        __out.push(__sanitize(this.model.getString("aarea")));
      
        __out.push('<br>\n          攻数：');
      
        __out.push(__sanitize(this.model.getString("anum")));
      
        __out.push('<br>\n        </p>\n        <p class="media-info">\n          攻速：');
      
        __out.push(__sanitize(this.model.getString("aspd")));
      
        __out.push('<br>\n          韧性：');
      
        __out.push(__sanitize(this.model.getString("tenacity")));
      
        __out.push('<br>\n          移速：');
      
        __out.push(__sanitize(this.model.getString("mspd")));
      
        __out.push('<br>\n          多段：');
      
        __out.push(__sanitize(this.model.getString("hits")));
      
        __out.push('<br>\n        </p>\n        <p class="media-info hidden-xs">\n          成长：');
      
        __out.push(__sanitize(this.model.getTypeString()));
      
        __out.push('<br>\n          火：');
      
        __out.push(__sanitize(this.model.getElementPercentString("fire")));
      
        __out.push('<br>\n          水：');
      
        __out.push(__sanitize(this.model.getElementPercentString("aqua")));
      
        __out.push('<br>\n          风：');
      
        __out.push(__sanitize(this.model.getElementPercentString("wind")));
      
        __out.push('<br>\n        </p>\n        <p class="media-info hidden-sm">\n          光：');
      
        __out.push(__sanitize(this.model.getElementPercentString("light")));
      
        __out.push('<br>\n          暗：');
      
        __out.push(__sanitize(this.model.getElementPercentString("dark")));
      
        __out.push('<br>\n          DPS：<span id="dps">');
      
        __out.push(__sanitize(this.model.get("dps")));
      
        __out.push('</span><br>\n          总DPS：<span id="mdps">');
      
        __out.push(__sanitize(this.model.get("mdps")));
      
        __out.push('</span><br>\n        </p>\n\n      </div>\n    </div>\n  </a>\n</li>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

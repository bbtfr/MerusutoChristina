(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/sidebar"] = function(__obj) {
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
        __out.push('<sidebar class="content sidebar">\n  <ul class="table-view">\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="#units">\n        <span class="media-object pull-left icon icon-person"></span>\n        <div class="media-body">\n          同伴\n        </div>\n      </a>\n    </li>\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="#monsters">\n        <span class="media-object pull-left icon icon-gear"></span>\n        <div class="media-body">\n          魔宠\n        </div>\n      </a>\n    </li>\n  </ul>\n  <ul class="table-view">\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="../gacha/">\n        <span class="media-object pull-left icon icon-pages"></span>\n        <div class="media-body">\n          模拟抽卡\n        </div>\n      </a>\n    </li>\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="../desktop/">\n        <span class="media-object pull-left icon icon-home"></span>\n        <div class="media-body">\n          桌面版\n        </div>\n      </a>\n    </li>\n  </ul>\n</sidebar>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

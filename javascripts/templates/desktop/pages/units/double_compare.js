(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/units/double_compare"] = function(__obj) {
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
        __out.push('<div class="compare">\n  <ul class="list-inline pull-right links">\n    <li><a href="#units/');
      
        __out.push(__sanitize(this.collection[1].id));
      
        __out.push('">返回详情页</a></li>\n    <li><a href="#units">返回列表页</a></li>\n  </ul>\n\n  <div class="row compare-body">\n    <div class="clearfix col-xs-12"></div>\n    <div class="col-xs-6">\n      <div class="page-header">\n        <h2>\n          ');
      
        __out.push(__sanitize(this.collection[1].getTitleString()));
      
        __out.push('\n          <br class="visible-xs-block">\n          <small>');
      
        __out.push(__sanitize(this.collection[1].getRareString()));
      
        __out.push('</small>\n          <small>ID: ');
      
        __out.push(__sanitize(this.collection[1].get("id")));
      
        __out.push('</small>\n        </h2>\n      </div>\n    </div>\n    <div class="col-xs-6">\n      <div class="page-header">\n        <h2>\n          ');
      
        __out.push(__sanitize(this.collection[0].getTitleString()));
      
        __out.push('\n          <br class="visible-xs-block">\n          <small>');
      
        __out.push(__sanitize(this.collection[0].getRareString()));
      
        __out.push('</small>\n          <small>ID: ');
      
        __out.push(__sanitize(this.collection[0].get("id")));
      
        __out.push('</small>\n        </h2>\n      </div>\n    </div>\n\n    <div class="clearfix col-xs-12"></div>\n    <div class="col-xs-6">\n      ');
      
        __out.push(_.renderTemplate("templates/desktop/pages/units/part_compare", {
          model: this.collection[1],
          other_model: this.collection[0]
        }));
      
        __out.push('\n    </div>\n    <div class="col-xs-6">\n      ');
      
        __out.push(_.renderTemplate("templates/desktop/pages/units/part_compare", {
          model: this.collection[0],
          other_model: this.collection[1]
        }));
      
        __out.push('\n    </div>\n\n    <div class="clearfix col-xs-12"></div>\n    <div class="col-xs-6 image">\n      <img src="');
      
        __out.push(__sanitize(this.collection[1].originalUrl()));
      
        __out.push('">\n    </div>\n    <div class="col-xs-6 image">\n      <img src="');
      
        __out.push(__sanitize(this.collection[0].originalUrl()));
      
        __out.push('">\n    </div>\n\n  </div>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

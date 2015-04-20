(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/changyan"] = function(__obj) {
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
        __out.push('<div id="SOHUCS" sid="');
      
        __out.push(__sanitize(this.model.klass));
      
        __out.push('/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('"></div>\n<script>\n  (function(){\n    var appid = \'cyrJvMFA2\',\n    conf = \'prod_7ffe2b28ab36796e3edc4802fc206f17\';\n    var doc = document,\n    s = doc.createElement(\'script\'),\n    h = doc.getElementsByTagName(\'head\')[0] || doc.head || doc.documentElement;\n    s.type = \'text/javascript\';\n    s.charset = \'utf-8\';\n    s.src =  \'http://assets.changyan.sohu.com/upload/changyan.js?conf=\'+ conf +\'&appid=\' + appid;\n    h.insertBefore(s,h.firstChild);\n    window.SCS_NO_IFRAME = true;\n  })()\n</script>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

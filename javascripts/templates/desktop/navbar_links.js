(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/navbar_links"] = function(__obj) {
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
        __out.push('<li ');
      
        if (location.hash.startsWith('#units')) {
          __out.push(__sanitize("class='active'"));
        }
      
        __out.push('><a href="#units">同伴</a></li>\n<li ');
      
        if (location.hash.startsWith('#monsters')) {
          __out.push(__sanitize("class='active'"));
        }
      
        __out.push('><a href="#monsters">魔宠</a></li>\n<li><a href="../gacha/">模拟抽卡</a></li>\n<li><a href="../mobile/">手机版</a></li>\n<li><a href="../readme/">关于</a></li>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

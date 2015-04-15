(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/disqus"] = function(__obj) {
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
        __out.push('<div id="disqus_thread"></div>\n<script type="text/javascript">\n  /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n  var disqus_shortname = \'merusuto\';\n  var disqus_identifier = \'');
      
        __out.push(__sanitize(this.model.klass));
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('\';\n  var disqus_title = \'');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\';\n  var disqus_url = \'');
      
        __out.push(__sanitize(window.location.href.replace("#", "#!")));
      
        __out.push('\';\n  var disqus_config = function () {\n    this.language = "zh";\n  };\n\n  if (typeof DISQUS === "undefined") {\n    /* * * DON\'T EDIT BELOW THIS LINE * * */\n    (function() {\n      var dsq = document.createElement(\'script\');\n      dsq.type = \'text/javascript\'; dsq.async = true;\n      dsq.src = \'http://\' + disqus_shortname + \'.disqus.com/embed.js\';\n      (document.getElementsByTagName(\'head\')[0] || document.getElementsByTagName(\'body\')[0]).appendChild(dsq);\n    })();\n  } else {\n    DISQUS.reset({\n      reload: true,\n      config: function () {\n        this.page.identifier = disqus_identifier;\n        this.page.title = disqus_title;\n        this.page.url = disqus_url;\n        this.language = "zh";\n      }\n    });\n  }\n</script>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

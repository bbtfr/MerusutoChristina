(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/mirror_info"] = function(__obj) {
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
        if (!(location.href.includes("gitcafe") || location.href.includes("coding") || (typeof localStorage !== "undefined" && localStorage !== null ? localStorage["mirror-info-disabled"] : void 0))) {
          __out.push('\n  <div class="container-fluid">\n    <div class="alert alert-info alert-dismissible fade in" id="mirror-alert">\n      <button type="button" class="close" data-dismiss="alert"><span>×</span></button>\n      <h4>梅露可图鉴 国内镜像</h4>\n      <p>为保证服务质量，梅露可图鉴在国内服务器上部属了一份镜像网站，国内用户访问更快更稳定，避免网站偶尔由于不可抗力访问不到！</p>\n      <p>\n        <a href="http://merusuto.gitcafe.io/readme/" class="btn btn-info">访问国内镜像</a>\n        <button type="button" class="btn btn-default" id="mirror-disable-button">不再显示这条消息</button>\n      </p>\n    </div>\n  </div>\n\n  <script type="text/javascript">\n    $("#mirror-disable-button").click(function() {\n      $("#mirror-alert").alert("close");\n      if (_.isObject(localStorage)) {\n        localStorage["mirror-info-disabled"] = true\n      }\n    })\n  </script>\n');
        }
      
        __out.push('\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

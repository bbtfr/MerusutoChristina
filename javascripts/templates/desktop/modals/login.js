(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/modals/login"] = function(__obj) {
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
        __out.push('<div class="modal-dialog">\n  <div class="modal-content">\n    <div class="modal-header">\n      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n      <h4 class="modal-title">用户登录</h4>\n    </div>\n    <form class="form-horizontal">\n      <div class="modal-body">\n        <div class="form-group">\n          <label for="username" class="col-sm-2 control-label">用户名</label>\n          <div class="col-sm-10">\n            <input type="text" class="form-control" id="username" placeholder="用户名">\n          </div>\n        </div>\n        <div class="form-group">\n          <label for="password" class="col-sm-2 control-label">登录密码</label>\n          <div class="col-sm-10">\n            <input type="password" class="form-control" id="password" placeholder="登录密码">\n          </div>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="submit" class="btn btn-primary">登录</button>\n      </div>\n    </form>\n  </div>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

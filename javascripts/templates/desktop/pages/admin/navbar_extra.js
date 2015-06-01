(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/admin/navbar_extra"] = function(__obj) {
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
        __out.push('<li class="navbar-form">\n  <input type="text" class="form-control" placeholder="搜索" id="search">\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">审核状态 <span class="caret"></span></a>\n  <ul class="dropdown-menu">\n    <li class="active"><a class="state" data-key="">全部</a></li>\n    <li><a class="state" data-key="等待审核">等待审核</a></li>\n    <li><a class="state" data-key="审核通过">审核通过</a></li>\n    <li><a class="state" data-key="审核拒绝">审核拒绝</a></li>\n    <li><a class="state" data-key="数据已合并">数据已合并</a></li>\n    <li><a class="state" data-key="数据已作废">数据已作废</a></li>\n  </ul>\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">每页显示条目数 <span class="caret"></span></a>\n  <ul class="dropdown-menu">\n    <li class="active"><a class="page" data-key="10">10</a></li>\n    <li><a class="page" data-key="25">25</a></li>\n    <li><a class="page" data-key="50">50</a></li>\n    <li><a class="page" data-key="100">100</a></li>\n    <li><a class="page" data-key="-1">全部</a></li>\n  </ul>\n</li>\n<li>\n  <a class="action-logout" href="#">登出</a>\n</li>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/monsters/navbar_extra"] = function(__obj) {
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
        __out.push('<li class="navbar-form">\n  <input type="text" class="form-control" placeholder="搜索同伴" id="search">\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">等级 <span class="caret"></span></a>\n  <ul class="dropdown-menu">\n    <li class="active"><a class="level-mode" data-key="sm">幼年期（1.0）</a></li>\n    <li><a class="level-mode" data-key="md">成长期（1.35）</a></li>\n    <li><a class="level-mode" data-key="lg">成熟期（1.55）</a></li>\n    <li><a class="level-mode" data-key="xl">完全体（1.7）</a></li>\n    <li><a class="level-mode" data-key="xxl">天然完全体（1.8）</a></li>\n  </ul>\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">筛选 <span class="caret"></span></a>\n  <ul class="dropdown-menu">\n    <li class="dropdown-submenu">\n      <a class="">稀有度</a>\n      <ul class="dropdown-menu">\n        <li><a class="filter-reset" data-key="rare">全部</a></li>\n        <li><a class="filter" data-key="rare" data-value="1">★</a></li>\n        <li><a class="filter" data-key="rare" data-value="2">★★</a></li>\n        <li><a class="filter" data-key="rare" data-value="3">★★★</a></li>\n        <li><a class="filter" data-key="rare" data-value="4">★★★★</a></li>\n        <li><a class="filter" data-key="rare" data-value="[3,4]">★★★以上</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">元素</a>\n      <ul class="dropdown-menu">\n        <li><a class="filter-reset" data-key="element">全部</a></li>\n        <li><a class="filter" data-key="element" data-value="1">火</a></li>\n        <li><a class="filter" data-key="element" data-value="2">水</a></li>\n        <li><a class="filter" data-key="element" data-value="3">风</a></li>\n        <li><a class="filter" data-key="element" data-value="4">光</a></li>\n        <li><a class="filter" data-key="element" data-value="5">暗</a></li>\n        <li><a class="filter" data-key="element" data-value="[1,2,3]">火/水/风</a></li>\n        <li><a class="filter" data-key="element" data-value="[4,5]">光/暗</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">皮肤</a>\n      <ul class="dropdown-menu">\n        <li><a class="filter-reset" data-key="skin">全部</a></li>\n        <li><a class="filter" data-key="skin" data-value="1">坚硬</a></li>\n        <li><a class="filter" data-key="skin" data-value="2">常规</a></li>\n        <li><a class="filter" data-key="skin" data-value="3">柔软</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">技能</a>\n      <ul class="dropdown-menu" id="skill">\n        <li><a class="filter-reset" data-key="skill-sc">全部</a></li>\n      </ul>\n    </li>\n    <li class="divider"></li>\n    <li><a class="filter-reset">重置</a></li>\n  </ul>\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">显示 / 隐藏项目 <span class="caret"></span></a>\n  <ul class="dropdown-menu" id="colvis"></ul>\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">每页显示条目数 <span class="caret"></span></a>\n  <ul class="dropdown-menu">\n    <li><a class="page" data-key="10">10</a></li>\n    <li><a class="page" data-key="25">25</a></li>\n    <li class="active"><a class="page" data-key="50">50</a></li>\n    <li><a class="page" data-key="100">100</a></li>\n    <li><a class="page" data-key="200">200</a></li>\n    <li><a class="page" data-key="-1">全部</a></li>\n  </ul>\n</li>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/units/navbar_extra"] = function(__obj) {
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
        __out.push('<li class="navbar-form">\n  <input type="text" class="form-control" placeholder="搜索同伴" id="search">\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">等级 <span class="caret"></span></a>\n  <ul class="dropdown-menu">\n    <li class="active"><a class="level-mode" data-key="zero">零觉零级</a></li>\n    <li><a class="level-mode" data-key="mxlv">零觉满级</a></li>\n    <li><a class="level-mode" data-key="mxlvgr">满觉满级</a></li>\n  </ul>\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">筛选 <span class="caret"></span></a>\n  <ul class="dropdown-menu">\n    <li class="dropdown-submenu">\n      <a class="">稀有度</a>\n      <ul class="dropdown-menu">\n        <li><a class="filter-reset" data-key="rare">全部</a></li>\n        <li><a class="filter" data-key="rare" data-value="1">★</a></li>\n        <li><a class="filter" data-key="rare" data-value="2">★★</a></li>\n        <li><a class="filter" data-key="rare" data-value="3">★★★</a></li>\n        <li><a class="filter" data-key="rare" data-value="4">★★★★</a></li>\n        <li><a class="filter" data-key="rare" data-value="5">★★★★★</a></li>\n        <li><a class="filter" data-key="rare" data-value="[3,4,5]">★★★以上</a></li>\n        <li><a class="filter" data-key="rare" data-value="[4,5]">★★★★以上</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">元素</a>\n      <ul class="dropdown-menu">\n        <li><a class="filter-reset" data-key="element">全部</a></li>\n        <li><a class="filter" data-key="element" data-value="1">火</a></li>\n        <li><a class="filter" data-key="element" data-value="2">水</a></li>\n        <li><a class="filter" data-key="element" data-value="3">风</a></li>\n        <li><a class="filter" data-key="element" data-value="4">光</a></li>\n        <li><a class="filter" data-key="element" data-value="5">暗</a></li>\n        <li><a class="filter" data-key="element" data-value="[1,2,3]">火/水/风</a></li>\n        <li><a class="filter" data-key="element" data-value="[4,5]">光/暗</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">武器</a>\n      <ul class="dropdown-menu">\n        <li><a class="filter-reset" data-key="weapon">全部</a></li>\n        <li><a class="filter" data-key="weapon" data-value="1">斩击</a></li>\n        <li><a class="filter" data-key="weapon" data-value="2">突击</a></li>\n        <li><a class="filter" data-key="weapon" data-value="3">打击</a></li>\n        <li><a class="filter" data-key="weapon" data-value="4">弓箭</a></li>\n        <li><a class="filter" data-key="weapon" data-value="5">魔法</a></li>\n        <li><a class="filter" data-key="weapon" data-value="6">铳弹</a></li>\n        <li><a class="filter" data-key="weapon" data-value="7">回复</a></li>\n        <li><a class="filter" data-key="weapon" data-value="[1,2,3]">斩/突/打</a></li>\n        <li><a class="filter" data-key="weapon" data-value="[4,5,6]">弓/魔/铳</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">成长</a>\n      <ul class="dropdown-menu">\n        <li><a class="filter-reset" data-key="type">全部</a></li>\n        <li><a class="filter" data-key="type" data-value="1">早熟</a></li>\n        <li><a class="filter" data-key="type" data-value="2">平均</a></li>\n        <li><a class="filter" data-key="type" data-value="3">晚成</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">攻击距离</a>\n      <ul class="dropdown-menu" id="aarea">\n        <li><a class="filter-reset" data-key="aarea">全部</a></li>\n        <li><a class="filter" data-key="aarea" data-value="0-50">近程</a></li>\n        <li><a class="filter" data-key="aarea" data-value="50-150">中程</a></li>\n        <li><a class="filter" data-key="aarea" data-value="150-500">远程</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">攻击数量</a>\n      <ul class="dropdown-menu">\n        <li><a class="filter-reset" data-key="anum">全部</a></li>\n        <li><a class="filter" data-key="anum" data-value="1">1体</a></li>\n        <li><a class="filter" data-key="anum" data-value="2">2体</a></li>\n        <li><a class="filter" data-key="anum" data-value="3">3体</a></li>\n        <li><a class="filter" data-key="anum" data-value="4">4体</a></li>\n        <li><a class="filter" data-key="anum" data-value="5">5体</a></li>\n        <li><a class="filter" data-key="anum" data-value="[2,3]">2/3体</a></li>\n        <li><a class="filter" data-key="anum" data-value="[4,5]">4/5体</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">性别</a>\n      <ul class="dropdown-menu">\n        <li><a class="filter-reset" data-key="gender">全部</a></li>\n        <li><a class="filter" data-key="gender" data-value="1">不明</a></li>\n        <li><a class="filter" data-key="gender" data-value="2">男</a></li>\n        <li><a class="filter" data-key="gender" data-value="3">女</a></li>\n      </ul>\n    </li>\n    <li class="dropdown-submenu">\n      <a class="">国别</a>\n      <ul class="dropdown-menu" id="country">\n        <li><a class="filter-reset" data-key="country">全部</a></li>\n      </ul>\n    </li>\n    <li class="divider"></li>\n    <li><a class="filter-reset">重置</a></li>\n  </ul>\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">显示 / 隐藏项目 <span class="caret"></span></a>\n  <ul class="dropdown-menu" id="colvis"></ul>\n</li>\n<li class="dropdown">\n  <a href="#" class="dropdown-toggle" data-toggle="dropdown">每页显示条目数 <span class="caret"></span></a>\n  <ul class="dropdown-menu">\n    <li><a class="page" data-key="10">10</a></li>\n    <li><a class="page" data-key="25">25</a></li>\n    <li class="active"><a class="page" data-key="50">50</a></li>\n    <li><a class="page" data-key="100">100</a></li>\n    <li><a class="page" data-key="200">200</a></li>\n    <li><a class="page" data-key="-1">全部</a></li>\n  </ul>\n</li>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/pages/monsters/header"] = function(__obj) {
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
        __out.push('<header class="bar bar-nav">\n\n  <div class="input-icon input-search" style="display:none;">\n    <span class="icon icon-search"></span>\n    <input type="search" placeholder="Search">\n    <a class="icon icon-close pull-right search-close"></a>\n  </div>\n\n  <a class="icon icon-bars pull-left" sref="#toggle-sidebar"></a>\n  <a class="icon icon-search pull-right search-open"></a>\n  <div class="dropdown pull-right">\n    <a class="btn btn-link dropdown-toggle">\n      筛选\n    </a>\n    <ul class="dropdown-menu">\n      <li class="dropdown-submenu pull-left">\n        <a class="">稀有度</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="rare">全部</a></li>\n          <li><a class="filter" data-key="rare" data-value="1">★</a></li>\n          <li><a class="filter" data-key="rare" data-value="2">★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="3">★★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="4">★★★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="[3,4]">★★★以上</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">元素</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="element">全部</a></li>\n          <li><a class="filter" data-key="element" data-value="1">火</a></li>\n          <li><a class="filter" data-key="element" data-value="2">水</a></li>\n          <li><a class="filter" data-key="element" data-value="3">风</a></li>\n          <li><a class="filter" data-key="element" data-value="4">光</a></li>\n          <li><a class="filter" data-key="element" data-value="5">暗</a></li>\n          <li><a class="filter" data-key="element" data-value="[1,2,3]">火/水/风</a></li>\n          <li><a class="filter" data-key="element" data-value="[4,5]">光/暗</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">皮肤</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="skin">全部</a></li>\n          <li><a class="filter" data-key="skin" data-value="1">坚硬</a></li>\n          <li><a class="filter" data-key="skin" data-value="2">常规</a></li>\n          <li><a class="filter" data-key="skin" data-value="3">柔软</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">技能</a>\n        <ul class="dropdown-menu" id="skill">\n          <li><a class="filter-reset" data-key="skill-sc">全部</a></li>\n        </ul>\n      </li>\n      <li class="divider"></li>\n      <li><a class="filter-reset">重置</a></li>\n    </ul>\n  </div>\n  <div class="dropdown pull-right">\n    <a class="btn btn-link dropdown-toggle">\n      排序\n    </a>\n    <ul class="dropdown-menu">\n      <li class="active"><a class="sort-mode" data-key="rare">稀有度</a></li>\n      <li><a class="sort-mode" data-key="dps">单体DPS</a></li>\n      <li><a class="sort-mode" data-key="mdps">多体DPS</a></li>\n      <li><a class="sort-mode" data-key="life">生命力</a></li>\n      <li><a class="sort-mode" data-key="atk">攻击</a></li>\n      <li><a class="sort-mode" data-key="aarea">攻击距离</a></li>\n      <li><a class="sort-mode" data-key="anum">攻击数量</a></li>\n      <li><a class="sort-mode" data-key="aspd">攻击速度</a></li>\n      <li><a class="sort-mode" data-key="tenacity">韧性</a></li>\n      <li><a class="sort-mode" data-key="mspd">移动速度</a></li>\n      <li><a class="sort-mode" data-key="id">新品上架</a></li>\n    </ul>\n  </div>\n  <div class="dropdown pull-right">\n    <a class="btn btn-link dropdown-toggle">\n      等级\n    </a>\n    <ul class="dropdown-menu">\n      <li class="active"><a class="level-mode" data-key="sm">幼年期（1.0）</a></li>\n      <li><a class="level-mode" data-key="md">成长期（1.35）</a></li>\n      <li><a class="level-mode" data-key="lg">成熟期（1.55）</a></li>\n      <li><a class="level-mode" data-key="xl">完全体（1.7）</a></li>\n      <li><a class="level-mode" data-key="xxl">天然完全体（1.8）</a></li>\n    </ul>\n  </div>\n  <h1 class="title">');
      
        __out.push(__sanitize(this.title));
      
        __out.push('</h1>\n</header>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

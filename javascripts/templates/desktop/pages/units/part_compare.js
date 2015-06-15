(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/units/part_compare"] = function(__obj) {
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
        var compareObject, compareValue;
      
        compareValue = function(v1, v2) {
          if ((v1 != null ? v1.toString() : void 0) === "NaN" && (v2 != null ? v2.toString() : void 0) === "NaN" || v1 === v2) {
            return 'text-default';
          } else if ((v2 != null ? v2.toString() : void 0) === "NaN" || (v2 == null) || v1 > v2) {
            return 'text-danger';
          } else {
            return 'text-success';
          }
        };
      
        __out.push('\n');
      
        compareObject = function(o1, o2, func, args) {
          return compareValue(o1[func].call(o1, args), o2[func].call(o2, args));
        };
      
        __out.push('\n\n<div class="row">\n  <p class="col-sm-6">\n    <span class="');
      
        __out.push(__sanitize(compareValue(this.model.origin.life, this.other_model.origin.life)));
      
        __out.push('">初始生命：');
      
        __out.push(__sanitize(this.model.origin.life));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "calcMaxLv", "life")));
      
        __out.push('">满级生命：');
      
        __out.push(__sanitize(this.model.calcMaxLv("life")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "calcMaxLvAndGrow", "life")));
      
        __out.push('">满觉生命：');
      
        __out.push(__sanitize(this.model.calcMaxLvAndGrow("life")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareValue(this.model.origin.atk, this.other_model.origin.atk)));
      
        __out.push('">初始攻击：');
      
        __out.push(__sanitize(this.model.origin.atk));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "calcMaxLv", "atk")));
      
        __out.push('">满级攻击：');
      
        __out.push(__sanitize(this.model.calcMaxLv("atk")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "calcMaxLvAndGrow", "atk")));
      
        __out.push('">满觉攻击：');
      
        __out.push(__sanitize(this.model.calcMaxLvAndGrow("atk")));
      
        __out.push('</span><br>\n  </p>\n  <p class="col-sm-6">\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "aarea")));
      
        __out.push('">攻距：');
      
        __out.push(__sanitize(this.model.getString("aarea")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "anum")));
      
        __out.push('">攻数：');
      
        __out.push(__sanitize(this.model.getString("anum")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.other_model, this.model, "get", "aarea")));
      
        __out.push('">攻速：');
      
        __out.push(__sanitize(this.model.getString("aspd")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "tenacity")));
      
        __out.push('">韧性：');
      
        __out.push(__sanitize(this.model.getString("tenacity")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "mspd")));
      
        __out.push('">移速：');
      
        __out.push(__sanitize(this.model.getString("mspd")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "hits")));
      
        __out.push('">多段：');
      
        __out.push(__sanitize(this.model.getString("hits")));
      
        __out.push('</span><br>\n  </p>\n</div>\n<div class="row">\n  <p class="col-sm-6">\n    <span class="');
      
        __out.push(__sanitize(compareValue(this.model.origin.dps, this.other_model.origin.dps)));
      
        __out.push('">初始DPS：');
      
        __out.push(__sanitize(Math.round(this.model.origin.dps)));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "calcMaxLv", "dps")));
      
        __out.push('">满级DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLv("dps"))));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "calcMaxLvAndGrow", "dps")));
      
        __out.push('">满觉DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLvAndGrow("dps"))));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareValue(this.model.origin.mdps, this.other_model.origin.mdps)));
      
        __out.push('">初始总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.origin.mdps)));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "calcMaxLv", "mdps")));
      
        __out.push('">满级总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLv("mdps"))));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "calcMaxLvAndGrow", "mdps")));
      
        __out.push('">满觉总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLvAndGrow("mdps"))));
      
        __out.push('</span><br>\n  </p>\n  <p class="col-sm-6">\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "type")));
      
        __out.push('">成长：');
      
        __out.push(__sanitize(this.model.getTypeString()));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "fire")));
      
        __out.push('">火：');
      
        __out.push(__sanitize(this.model.getElementPercentString("fire")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "aqua")));
      
        __out.push('">水：');
      
        __out.push(__sanitize(this.model.getElementPercentString("aqua")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "wind")));
      
        __out.push('">风：');
      
        __out.push(__sanitize(this.model.getElementPercentString("wind")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "light")));
      
        __out.push('">光：');
      
        __out.push(__sanitize(this.model.getElementPercentString("light")));
      
        __out.push('</span><br>\n    <span class="');
      
        __out.push(__sanitize(compareObject(this.model, this.other_model, "get", "dark")));
      
        __out.push('">暗：');
      
        __out.push(__sanitize(this.model.getElementPercentString("dark")));
      
        __out.push('</span><br>\n  </p>\n</div>\n<div class="row">\n  <p class="col-sm-6">\n    国家：');
      
        __out.push(__sanitize(this.model.getString('country')));
      
        __out.push('<br>\n    性别：');
      
        __out.push(__sanitize(this.model.getGenderString()));
      
        __out.push('<br>\n    年龄：');
      
        __out.push(__sanitize(this.model.getAgeString()));
      
        __out.push('<br>\n  </p>\n  <p class="col-sm-6">\n    职业：');
      
        __out.push(__sanitize(this.model.getString('career')));
      
        __out.push('<br>\n    兴趣：');
      
        __out.push(__sanitize(this.model.getString('interest')));
      
        __out.push('<br>\n    性格：');
      
        __out.push(__sanitize(this.model.getString('nature')));
      
        __out.push('<br>\n  </p>\n</div>\n<div class="row">\n  <p class="col-sm-12">\n    获取方式：');
      
        __out.push(this.model.getFormatString('obtain'));
      
        __out.push('<br>\n    ');
      
        if (this.model.get('remark')) {
          __out.push('\n      备注：');
          __out.push(this.model.getFormatString('remark'));
          __out.push('<br>\n    ');
        }
      
        __out.push('\n  </p>\n</div>\n');
      
        if (this.model.get('contributors')) {
          __out.push('\n  <div class="row">\n    <p class="col-sm-12">\n      数据提供者：');
          __out.push(__sanitize(this.model.get('contributors').join("、")));
          __out.push('<br>\n    </p>\n  </div>\n');
        }
      
        __out.push('\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

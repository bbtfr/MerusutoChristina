(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/units/show"] = function(__obj) {
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
        __out.push('<div class="detail">\n  <ul class="list-inline pull-right links">\n    <li><a href="#units/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('/edit">数据补全 / 报错</a></li>\n    <li><a href="#units/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('/compare">数据比较</a></li>\n    <li><a href="#units">返回列表页</a></li>\n  </ul>\n\n  <div class="row detail-body">\n    <div class="col-md-5 left-side image">\n      <img src="');
      
        __out.push(__sanitize(this.model.originalUrl()));
      
        __out.push('">\n    </div>\n\n    <div class="col-md-7 right-side">\n      <div class="page-header">\n        <h2>\n          ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n          <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n          <small>ID: ');
      
        __out.push(__sanitize(this.model.get("id")));
      
        __out.push('</small>\n        </h2>\n      </div>\n      <div class="row">\n        <p class="col-xs-6">\n          初始生命：');
      
        __out.push(__sanitize(this.model.origin.life));
      
        __out.push('<br>\n          满级生命：');
      
        __out.push(__sanitize(this.model.calcMaxLv('life')));
      
        __out.push('<br>\n          满觉生命：');
      
        __out.push(__sanitize(this.model.calcMaxLvAndGrow('life')));
      
        __out.push('<br>\n          初始攻击：');
      
        __out.push(__sanitize(this.model.origin.atk));
      
        __out.push('<br>\n          满级攻击：');
      
        __out.push(__sanitize(this.model.calcMaxLv('atk')));
      
        __out.push('<br>\n          满觉攻击：');
      
        __out.push(__sanitize(this.model.calcMaxLvAndGrow('atk')));
      
        __out.push('<br>\n        </p>\n        <p class="col-xs-6">\n          攻距：');
      
        __out.push(__sanitize(this.model.getString("aarea")));
      
        __out.push('<br>\n          攻数：');
      
        __out.push(__sanitize(this.model.getString("anum")));
      
        __out.push('<br>\n          攻速：');
      
        __out.push(__sanitize(this.model.getString("aspd")));
      
        __out.push('<br>\n          韧性：');
      
        __out.push(__sanitize(this.model.getString("tenacity")));
      
        __out.push('<br>\n          移速：');
      
        __out.push(__sanitize(this.model.getString("mspd")));
      
        __out.push('<br>\n          多段：');
      
        __out.push(__sanitize(this.model.getString("hits")));
      
        __out.push('<br>\n        </p>\n      </div>\n      <div class="row">\n        <p class="col-xs-6">\n          初始DPS：');
      
        __out.push(__sanitize(Math.round(this.model.origin.dps)));
      
        __out.push('<br>\n          满级DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLv('dps'))));
      
        __out.push('<br>\n          满觉DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLvAndGrowDPS())));
      
        __out.push('<br>\n          初始总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.origin.mdps)));
      
        __out.push('<br>\n          满级总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLv('mdps'))));
      
        __out.push('<br>\n          满觉总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLvAndGrowMDPS())));
      
        __out.push('<br>\n        </p>\n        <p class="col-xs-6">\n          成长：');
      
        __out.push(__sanitize(this.model.getTypeString()));
      
        __out.push('<br>\n          火：');
      
        __out.push(__sanitize(this.model.getElementPercentString("fire")));
      
        __out.push('<br>\n          水：');
      
        __out.push(__sanitize(this.model.getElementPercentString("aqua")));
      
        __out.push('<br>\n          风：');
      
        __out.push(__sanitize(this.model.getElementPercentString("wind")));
      
        __out.push('<br>\n          光：');
      
        __out.push(__sanitize(this.model.getElementPercentString("light")));
      
        __out.push('<br>\n          暗：');
      
        __out.push(__sanitize(this.model.getElementPercentString("dark")));
      
        __out.push('<br>\n        </p>\n      </div>\n      <div class="row">\n        <p class="col-xs-6">\n          国家：');
      
        __out.push(__sanitize(this.model.getString('country')));
      
        __out.push('<br>\n          性别：');
      
        __out.push(__sanitize(this.model.getGenderString()));
      
        __out.push('<br>\n          年龄：');
      
        __out.push(__sanitize(this.model.getAgeString()));
      
        __out.push('<br>\n        </p>\n        <p class="col-xs-6">\n          职业：');
      
        __out.push(__sanitize(this.model.getString('career')));
      
        __out.push('<br>\n          兴趣：');
      
        __out.push(__sanitize(this.model.getString('interest')));
      
        __out.push('<br>\n          性格：');
      
        __out.push(__sanitize(this.model.getString('nature')));
      
        __out.push('<br>\n        </p>\n      </div>\n      <div class="row">\n        <p class="col-xs-12">\n          获取方式：');
      
        __out.push(this.model.getFormatString('obtain'));
      
        __out.push('<br>\n          ');
      
        if (this.model.get('remark')) {
          __out.push('\n            备注：');
          __out.push(this.model.getFormatString('remark'));
          __out.push('<br>\n          ');
        }
      
        __out.push('\n        </p>\n      </div>\n      ');
      
        if (this.model.get('contributors')) {
          __out.push('\n        <div class="row">\n          <p class="col-xs-12">\n            数据提供者：');
          __out.push(__sanitize(this.model.get('contributors').join("、")));
          __out.push('<br>\n          </p>\n        </div>\n      ');
        }
      
        __out.push('\n    </div>\n  </div>\n\n  <div class="row">\n    <div class="col-md-offset-5 col-md-5">\n      ');
      
        __out.push(_.renderTemplate("templates/desktop/pages/disqus", {
          model: this.model
        }));
      
        __out.push('\n    </div>\n  </div>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

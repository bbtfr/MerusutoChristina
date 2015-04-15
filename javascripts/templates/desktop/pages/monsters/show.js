(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/monsters/show"] = function(__obj) {
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
        __out.push('<div class="detail">\n  <ul class="list-inline pull-right links">\n    <li><a href="#monsters/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('/edit">数据补全 / 报错</a></li>\n    <li><a href="#monsters">返回列表页</a></li>\n  </ul>\n\n  <div class="row detail-body">\n    <div class="col-md-5 left-side image">\n      <img src="');
      
        __out.push(__sanitize(this.model.originalUrl()));
      
        __out.push('">\n    </div>\n\n    <div class="col-md-7 right-side">\n      <div class="page-header">\n        <h2>\n          ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n          <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n          <small>ID: ');
      
        __out.push(__sanitize(this.model.get("id")));
      
        __out.push('</small>\n        </h2>\n      </div>\n      <div class="row">\n        <p class="col-xs-6">\n          幼年期生命：');
      
        __out.push(__sanitize(this.model.origin.life));
      
        __out.push('<br>\n          成长期生命：');
      
        __out.push(__sanitize(this.model.calcBySize(this.model.origin.life, 1.35, 2)));
      
        __out.push('<br>\n          成熟期生命：');
      
        __out.push(__sanitize(this.model.calcBySize(this.model.origin.life, 1.55, 2)));
      
        __out.push('<br>\n          完全体生命：');
      
        __out.push(__sanitize(this.model.calcBySize(this.model.origin.life, 1.7, 2)));
      
        __out.push('<br>\n          天然完全体生命：');
      
        __out.push(__sanitize(this.model.calcBySize(this.model.origin.life, 1.8, 2)));
      
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
      
        __out.push('<br>\n          皮肤：');
      
        __out.push(__sanitize(this.model.getSkinString()));
      
        __out.push('<br>\n        </p>\n      </div>\n      <div class="row">\n        <p class="col-xs-6">\n          幼年期攻击：');
      
        __out.push(__sanitize(this.model.origin.atk));
      
        __out.push('<br>\n          成长期攻击：');
      
        __out.push(__sanitize(this.model.calcBySize(this.model.origin.atk, 1.35, 1)));
      
        __out.push('<br>\n          成熟期攻击：');
      
        __out.push(__sanitize(this.model.calcBySize(this.model.origin.atk, 1.55, 1)));
      
        __out.push('<br>\n          完全体攻击：');
      
        __out.push(__sanitize(this.model.calcBySize(this.model.origin.atk, 1.7, 1)));
      
        __out.push('<br>\n          天然完全体攻击：');
      
        __out.push(__sanitize(this.model.calcBySize(this.model.origin.atk, 1.8, 1)));
      
        __out.push('<br>\n        </p>\n        <p class="col-xs-6">\n          幼年期DPS：');
      
        __out.push(__sanitize(Math.round(this.model.origin.dps)));
      
        __out.push('<br>\n          成长期DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcBySize(this.model.origin.dps, 1.35, 1))));
      
        __out.push('<br>\n          成熟期DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcBySize(this.model.origin.dps, 1.55, 1))));
      
        __out.push('<br>\n          完全体DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcBySize(this.model.origin.dps, 1.7, 1))));
      
        __out.push('<br>\n          天然完全体DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcBySize(this.model.origin.dps, 1.8, 1))));
      
        __out.push('<br>\n        </p>\n      </div>\n      <div class="row">\n        <p class="col-xs-6">\n          幼年期总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.origin.mdps)));
      
        __out.push('<br>\n          成长期总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcBySize(this.model.origin.mdps, 1.35, 1))));
      
        __out.push('<br>\n          成熟期总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcBySize(this.model.origin.mdps, 1.55, 1))));
      
        __out.push('<br>\n          完全体总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcBySize(this.model.origin.mdps, 1.7, 1))));
      
        __out.push('<br>\n          天然完全体总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcBySize(this.model.origin.mdps, 1.8, 1))));
      
        __out.push('<br>\n        </p>\n        <p class="col-xs-6">\n          火：');
      
        __out.push(__sanitize(this.model.getElementPercentString("fire")));
      
        __out.push('<br>\n          水：');
      
        __out.push(__sanitize(this.model.getElementPercentString("aqua")));
      
        __out.push('<br>\n          风：');
      
        __out.push(__sanitize(this.model.getElementPercentString("wind")));
      
        __out.push('<br>\n          光：');
      
        __out.push(__sanitize(this.model.getElementPercentString("light")));
      
        __out.push('<br>\n          暗：');
      
        __out.push(__sanitize(this.model.getElementPercentString("dark")));
      
        __out.push('<br>\n        </p>\n      </div>\n      <div class="row">\n        <p class="col-xs-12">\n          技能：');
      
        __out.push(__sanitize(this.model.getString("skill")));
      
        __out.push('<br>\n          技能消耗：');
      
        __out.push(__sanitize(this.model.getString("sklsp")));
      
        __out.push('<br>\n          技能CD：');
      
        __out.push(__sanitize(this.model.getString("sklcd")));
      
        __out.push('<br>\n        </p>\n      </div>\n      <div class="row">\n        <p class="col-xs-12">\n          获取方式：');
      
        __out.push(__sanitize(this.model.getString('obtain')));
      
        __out.push('<br>\n          ');
      
        if (this.model.get('remark')) {
          __out.push('\n            备注：');
          __out.push(__sanitize(this.model.get('remark')));
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

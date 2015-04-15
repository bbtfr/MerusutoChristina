(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/modals/monsters/show"] = function(__obj) {
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
        __out.push(_.renderTemplate("templates/mobile/modals/header"));
      
        __out.push('\n<div class="content">\n  <div class="slider">\n    <div class="slide-group">\n      <div class="slide">\n        <img class="image" src="');
      
        __out.push(__sanitize(this.model.originalUrl()));
      
        __out.push('">\n      </div>\n      <div class="slide media">\n        <div class="media-body">\n          <h4 class="media-title media-info-group">\n            ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n            <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n            <br>\n            <small>ID: ');
      
        __out.push(__sanitize(this.model.get("id")));
      
        __out.push('</small>\n          </h4>\n          <div class="media-info-group">\n            <p class="media-info">\n              生命：');
      
        __out.push(__sanitize(this.model.origin.life));
      
        __out.push('<br>\n              攻击：');
      
        __out.push(__sanitize(this.model.origin.atk));
      
        __out.push('<br>\n              攻距：');
      
        __out.push(__sanitize(this.model.getString("aarea")));
      
        __out.push('<br>\n              攻数：');
      
        __out.push(__sanitize(this.model.getString("anum")));
      
        __out.push('<br>\n            </p>\n            <p class="media-info">\n              攻速：');
      
        __out.push(__sanitize(this.model.getString("aspd")));
      
        __out.push('<br>\n              韧性：');
      
        __out.push(__sanitize(this.model.getString("tenacity")));
      
        __out.push('<br>\n              移速：');
      
        __out.push(__sanitize(this.model.getString("mspd")));
      
        __out.push('<br>\n              皮肤：');
      
        __out.push(__sanitize(this.model.getSkinString()));
      
        __out.push('<br>\n            </p>\n          </div>\n          <div class="media-info-group">\n            <p class="media-info">\n              火：');
      
        __out.push(__sanitize(this.model.getElementPercentString("fire")));
      
        __out.push('<br>\n              水：');
      
        __out.push(__sanitize(this.model.getElementPercentString("aqua")));
      
        __out.push('<br>\n              风：');
      
        __out.push(__sanitize(this.model.getElementPercentString("wind")));
      
        __out.push('<br>\n              光：');
      
        __out.push(__sanitize(this.model.getElementPercentString("light")));
      
        __out.push('<br>\n              暗：');
      
        __out.push(__sanitize(this.model.getElementPercentString("dark")));
      
        __out.push('<br>\n            </p>\n            <p class="media-info">\n              DPS：');
      
        __out.push(__sanitize(Math.round(this.model.get("dps"))));
      
        __out.push('<br>\n              总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.get("mdps"))));
      
        __out.push('<br>\n            </p>\n          </div>\n          <div class="media-info-title">技能</div>\n          <p class="media-info">\n            ');
      
        __out.push(__sanitize(this.model.getString("skill")));
      
        __out.push('<br><br>\n            技能消耗：');
      
        __out.push(__sanitize(this.model.getString("sklsp")));
      
        __out.push('<br>\n            技能CD：');
      
        __out.push(__sanitize(this.model.getString("sklcd")));
      
        __out.push('<br>\n          </p>\n          <div class="media-info-title">获取方式</div>\n          <p class="media-info">\n            ');
      
        __out.push(__sanitize(this.model.getString('obtain')));
      
        __out.push('\n          </p>\n\n          ');
      
        if (this.model.get('remark')) {
          __out.push('\n            <div class="media-info-title">备注</div>\n            <p class="media-info">\n              ');
          __out.push(__sanitize(this.model.get("remark")));
          __out.push('\n            </p>\n          ');
        }
      
        __out.push('\n\n          ');
      
        if (this.model.get('contributors')) {
          __out.push('\n            <div class="media-info-title">数据提供者</div>\n            <p class="media-info">\n              ');
          __out.push(__sanitize(this.model.get('contributors').join("、")));
          __out.push('\n            </p>\n          ');
        }
      
        __out.push('\n\n          <a class="media-info" href="../desktop/#monsters/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('/edit">数据有误？点击这里</a>\n        </div>\n      </div>\n    </div>\n    <div class="slide-handler">\n      <span class="icon icon-right-nav slide-next"></span>\n      <span class="icon icon-left-nav slide-prev"></span>\n    </div>\n  </div>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

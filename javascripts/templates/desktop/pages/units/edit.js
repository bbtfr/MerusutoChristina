(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/units/edit"] = function(__obj) {
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
        __out.push('<div class="editor">\n  <ul class="list-inline pull-right links">\n    <li><a href="#units/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('">返回详情页</a></li>\n    <li><a href="#units">返回列表页</a></li>\n  </ul>\n\n  <div class="col-xs-12">\n    <div class="page-header">\n      <h2>\n        ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n        <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n        <small>ID: ');
      
        __out.push(__sanitize(this.model.get("id")));
      
        __out.push('</small>\n        <small class="text-danger" id="editing-warning">已有其他人提交了相关数据，管理员正在审核中</small>\n      </h2>\n    </div>\n\n    <form class="form-horizontal">\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="title" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["title"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="title" id="title" value="');
      
        __out.push(__sanitize(this.model.get("title")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="name" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["name"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="name" id="name" value="');
      
        __out.push(__sanitize(this.model.get("name")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="rare" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["rare"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="rare" id="rare" value="');
      
        __out.push(__sanitize(this.model.get("rare")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="element" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["element"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <select class="form-control" name="element" id="element">\n            <option ');
      
        if (this.model.get("element") === null) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('></option>\n            <option value="1" ');
      
        if (this.model.get("element") === 1) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>火</option>\n            <option value="2" ');
      
        if (this.model.get("element") === 2) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>水</option>\n            <option value="3" ');
      
        if (this.model.get("element") === 3) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>风</option>\n            <option value="4" ');
      
        if (this.model.get("element") === 4) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>光</option>\n            <option value="5" ');
      
        if (this.model.get("element") === 5) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>暗</option>\n          </select>\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="weapon" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["weapon"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <select class="form-control" name="weapon" id="weapon">\n            <option ');
      
        if (this.model.get("weapon") === null) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('></option>\n            <option value="1" ');
      
        if (this.model.get("weapon") === 1) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>斩击</option>\n            <option value="2" ');
      
        if (this.model.get("weapon") === 2) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>突击</option>\n            <option value="3" ');
      
        if (this.model.get("weapon") === 3) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>打击</option>\n            <option value="4" ');
      
        if (this.model.get("weapon") === 4) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>弓箭</option>\n            <option value="5" ');
      
        if (this.model.get("weapon") === 5) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>魔法</option>\n            <option value="6" ');
      
        if (this.model.get("weapon") === 6) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>铳弹</option>\n            <option value="7" ');
      
        if (this.model.get("weapon") === 7) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>回复</option>\n          </select>\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="type" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["type"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <select class="form-control" name="type" id="type">\n            <option ');
      
        if (this.model.get("type") === null) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('></option>\n            <option value="1" ');
      
        if (this.model.get("type") === 1) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>早熟</option>\n            <option value="2" ');
      
        if (this.model.get("type") === 2) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>平均</option>\n            <option value="3" ');
      
        if (this.model.get("type") === 3) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>晚成</option>\n          </select>\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="life" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["life"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="life" id="life" value="');
      
        __out.push(__sanitize(this.model.get("life")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="atk" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["atk"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="atk" id="atk" value="');
      
        __out.push(__sanitize(this.model.get("atk")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="aarea" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["aarea"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" step="any" class="form-control" name="aarea" id="aarea" value="');
      
        __out.push(__sanitize(this.model.get("aarea")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="anum" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["anum"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="anum" id="anum" value="');
      
        __out.push(__sanitize(this.model.get("anum")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="aspd" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["aspd"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" step="any" class="form-control" name="aspd" id="aspd" value="');
      
        __out.push(__sanitize(this.model.get("aspd")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="tenacity" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["tenacity"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="tenacity" id="tenacity" value="');
      
        __out.push(__sanitize(this.model.get("tenacity")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="mspd" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["mspd"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" step="any" class="form-control" name="mspd" id="mspd" value="');
      
        __out.push(__sanitize(this.model.get("mspd")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="hits" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["hits"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="hits" id="hits" value="');
      
        __out.push(__sanitize(this.model.get("hits")));
      
        __out.push('">\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="fire" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["fire"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" step="any" class="form-control" name="fire" id="fire" value="');
      
        __out.push(__sanitize(this.model.get("fire")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="aqua" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["aqua"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" step="any" class="form-control" name="aqua" id="aqua" value="');
      
        __out.push(__sanitize(this.model.get("aqua")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="wind" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["wind"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" step="any" class="form-control" name="wind" id="wind" value="');
      
        __out.push(__sanitize(this.model.get("wind")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="light" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["light"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" step="any" class="form-control" name="light" id="light" value="');
      
        __out.push(__sanitize(this.model.get("light")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="dark" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["dark"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" step="any" class="form-control" name="dark" id="dark" value="');
      
        __out.push(__sanitize(this.model.get("dark")));
      
        __out.push('">\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="country" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["country"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="country" id="country" value="');
      
        __out.push(__sanitize(this.model.get("country")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="gender" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["gender"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <select class="form-control" name="gender" id="gender">\n            <option ');
      
        if (this.model.get("gender") === null) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('></option>\n            <option value="1" ');
      
        if (this.model.get("gender") === 1) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>不明</option>\n            <option value="2" ');
      
        if (this.model.get("gender") === 2) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>男</option>\n            <option value="3" ');
      
        if (this.model.get("gender") === 3) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>女</option>\n          </select>\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="age" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["age"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="age" id="age" value="');
      
        __out.push(__sanitize(this.model.get("age")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="career" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["career"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="career" id="career" value="');
      
        __out.push(__sanitize(this.model.get("career")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="interest" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["interest"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="interest" id="interest" value="');
      
        __out.push(__sanitize(this.model.get("interest")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="nature" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["nature"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="nature" id="nature" value="');
      
        __out.push(__sanitize(this.model.get("nature")));
      
        __out.push('">\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <!-- <div class="form-group col-sm-6 col-md-4">\n        <label for="story" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["story"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <textarea rows="4" class="form-control" name="story" id="story">');
      
        __out.push(__sanitize(this.model.get("story")));
      
        __out.push('</textarea>\n        </div>\n      </div> -->\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="obtain" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["obtain"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <textarea rows="4" class="form-control" name="obtain" id="obtain">');
      
        __out.push(__sanitize(this.model.get("obtain")));
      
        __out.push('</textarea>\n        </div>\n      </div>\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="remark" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["remark"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <textarea rows="4" class="form-control" name="remark" id="remark">');
      
        __out.push(__sanitize(this.model.get("remark")));
      
        __out.push('</textarea>\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="nickname" class="col-sm-4 control-label">数据提供者</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="nickname" id="nickname">\n          <span class="help-block">此处昵称将出现在数据提供者名单中。</span>\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="contact" class="col-sm-4 control-label">联系方式</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="contact" id="contact">\n          <span class="help-block">QQ或邮箱，用于问题反馈。</span>\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <div class="col-sm-offset-4 col-sm-8">\n          <button type="submit" class="btn btn-primary">提交数据</button>\n        </div>\n      </div>\n    </form>\n  </div>\n\n  <div class="modal fade" id="confirm-modal">\n    <div class="modal-dialog">\n      <div class="modal-content">\n        <div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>\n          <h4 class="modal-title">提交数据</h4>\n        </div>\n        <div class="modal-body">\n          <p>\n            您提交的数据在被管理员审核后，将会更新到图鉴中；同时您的昵称也将会加入图鉴数据提供者名单，感谢您对图鉴的热情与贡献！\n          </p>\n          <p class="text-danger">\n            图鉴数据通常以<a href="http://xn--cckza4aydug8bd3l.gamerch.com/">日文Wiki</a>为准，如果您提交的数据与Wiki上的数据不符，且管理员无法验证数据的正确性时（指您提交的攻击力、血量等数据与Wiki上的数据不同，不包含角色年龄、兴趣、备注等额外数据），会拒绝您提交的数据。<br>\n            想要了解您提交数据的审核状态，请加QQ群：431278467\n          </p>\n          <p>您本次提交的修改包括：</p>\n          <ul id="changelog"></ul>\n          <p>您确定要提交这些修改么？</p>\n        </div>\n        <div class="modal-footer">\n          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n          <button type="button" class="btn btn-primary" id="confirm-button">确认提交</button>\n        </div>\n      </div><!-- /.modal-content -->\n    </div><!-- /.modal-dialog -->\n  </div><!-- /.modal -->\n</div>\n\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

(function() { this.JST || (this.JST = {}); this.JST["templates/desktop/pages/monsters/edit"] = function(__obj) {
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
        __out.push('<div class="editor">\n  <ul class="list-inline pull-right links">\n    <li><a href="#monsters/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('">返回详情页</a></li>\n    <li><a href="#monsters">返回列表页</a></li>\n  </ul>\n\n  <div class="col-xs-12">\n    <div class="page-header">\n      <h2>\n        ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n        <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n        <small>ID: ');
      
        __out.push(__sanitize(this.model.get("id")));
      
        __out.push('</small>\n        <small class="text-danger" id="editing-warning">已有其他人提交了相关数据，管理员正在审核中</small>\n      </h2>\n    </div>\n\n    <form class="form-horizontal">\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="name" class="col-sm-4 control-label">');
      
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
      
        __out.push('>暗</option>\n          </select>\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="skin" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["skin"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <select class="form-control" name="skin" id="skin">\n            <option ');
      
        if (this.model.get("skin") === null) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('></option>\n            <option value="1" ');
      
        if (this.model.get("skin") === 1) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>坚硬</option>\n            <option value="2" ');
      
        if (this.model.get("skin") === 2) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>常规</option>\n            <option value="3" ');
      
        if (this.model.get("skin") === 3) {
          __out.push(__sanitize("selected"));
        }
      
        __out.push('>柔软</option>\n          </select>\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="life" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["life"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="life" id="life" value="');
      
        __out.push(__sanitize(this.model.get("life")));
      
        __out.push('">\n          <span class="help-block"><a class="calculator">魔宠计算器</a>，计算初始生命、体力</span>\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="atk" class="col-sm-4 control-label">');
      
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
      
        __out.push('">\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="skill" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["skill"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <textarea rows="4" class="form-control" name="skill" id="skill">');
      
        __out.push(__sanitize(this.model.get("skill")));
      
        __out.push('</textarea>\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="sklcd" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["sklcd"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="sklcd" id="sklcd" value="');
      
        __out.push(__sanitize(this.model.get("sklcd")));
      
        __out.push('">\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="sklsp" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["sklsp"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <input type="number" class="form-control" name="sklsp" id="sklsp" value="');
      
        __out.push(__sanitize(this.model.get("sklsp")));
      
        __out.push('">\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="obtain" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["obtain"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <textarea rows="4" class="form-control" name="obtain" id="obtain">');
      
        __out.push(__sanitize(this.model.get("obtain")));
      
        __out.push('</textarea>\n        </div>\n      </div>\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="remark" class="col-sm-4 control-label">');
      
        __out.push(__sanitize(App.KeyMap["remark"]));
      
        __out.push('</label>\n        <div class="col-sm-8">\n          <textarea rows="4" class="form-control" name="remark" id="remark">');
      
        __out.push(__sanitize(this.model.get("remark")));
      
        __out.push('</textarea>\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="nickname" class="col-sm-4 control-label">数据提供者</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="nickname" id="nickname">\n          <span class="help-block">此处昵称将出现在数据提供者名单中。</span>\n        </div>\n      </div>\n      <div class="form-group col-sm-6 col-md-4">\n        <label for="contact" class="col-sm-4 control-label">联系方式</label>\n        <div class="col-sm-8">\n          <input type="text" class="form-control" name="contact" id="contact">\n          <span class="help-block">QQ或邮箱，用于问题反馈。</span>\n        </div>\n      </div>\n      <hr class="col-sm-11">\n\n      <div class="form-group col-sm-6 col-md-4">\n        <div class="col-sm-offset-4 col-sm-8">\n          <button type="submit" class="btn btn-primary">提交数据</button>\n        </div>\n      </div>\n    </form>\n  </div>\n\n  <div class="modal fade" id="confirm-modal">\n    <div class="modal-dialog">\n      <div class="modal-content">\n        <div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>\n          <h4 class="modal-title">提交数据</h4>\n        </div>\n        <div class="modal-body">\n          <p>\n            您提交的数据在被管理员审核后，将会更新到图鉴中；同时您的昵称也将会加入图鉴数据提供者名单，感谢您对图鉴的热情与贡献！\n          </p>\n          <p class="text-danger">\n            图鉴数据通常以<a href="http://xn--cckza4aydug8bd3l.gamerch.com/">日文Wiki</a>为准，如果您提交的数据与Wiki上的数据不符，且管理员无法验证数据的正确性时（指您提交的攻击力、血量等数据与Wiki上的数据不同，不包含角色年龄、兴趣、备注等额外数据），会拒绝您提交的数据。<br>\n            想要了解您提交数据的审核状态，请加QQ群：431278467\n          </p>\n          <p>您本次提交的修改包括：</p>\n          <ul id="changelog"></ul>\n          <p>您确定要提交这些修改么？</p>\n        </div>\n        <div class="modal-footer">\n          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n          <button type="button" class="btn btn-primary" id="confirm-button">确认提交</button>\n        </div>\n      </div><!-- /.modal-content -->\n    </div><!-- /.modal-dialog -->\n  </div><!-- /.modal -->\n\n  <div class="modal fade" id="calculator-modal">\n    <div class="modal-dialog">\n      <div class="modal-content">\n        <div class="modal-header">\n          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>\n          <h4 class="modal-title">魔宠计算器</h4>\n        </div>\n        <div class="modal-body form-horizontal">\n          <div class="form-group">\n            <label for="csize" class="col-xs-3 control-label">体型</label>\n            <div class="col-xs-5">\n              <input type="number" step="any" class="form-control" id="csize">\n            </div>\n          </div>\n          <div class="form-group">\n            <label for="clife" class="col-xs-3 control-label">生命</label>\n            <div class="col-xs-5">\n              <input type="number" class="form-control" id="clife">\n            </div>\n          </div>\n          <div class="form-group">\n            <label for="catk" class="col-xs-3 control-label">攻击</label>\n            <div class="col-xs-5">\n              <input type="number" class="form-control" id="catk">\n            </div>\n          </div>\n          <div class="form-group">\n            <label for="rlife" class="col-xs-3 control-label">初始生命</label>\n            <div class="col-xs-5">\n              <input type="text" class="form-control" id="rlife" readonly>\n            </div>\n          </div>\n          <div class="form-group">\n            <label for="ratk" class="col-xs-3 control-label">初始攻击</label>\n            <div class="col-xs-5">\n              <input type="text" class="form-control" id="ratk" readonly>\n            </div>\n          </div>\n        </div>\n        <div class="modal-footer">\n          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n          <button type="button" class="btn btn-primary" id="insert-button">插入数据</button>\n        </div>\n      </div><!-- /.modal-content -->\n    </div><!-- /.modal-dialog -->\n  </div><!-- /.modal -->\n</div>\n\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);

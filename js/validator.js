(function(global, factory, plug) {
	factory.call(global, global.jQuery, plug)
}(typeof window == 'undefined' ? this : window, function($, plug) {
	//可配置  默认
	var _I18N_ = {
		"en":{
			"notForm":"is not form element",
			"errorMsg":"* valid fail"
		},
//		"zh":{
//			"notForm":"非表单元素",
//			"errorMsg":"* 校验非法"
//		}
	}
	var _DEFS_ = {
		raise: "change",
		lang:"en",
		pix: "bv-", //前缀
		i18n:"en",
		errorMsg: null, //默认的提示错误信息
	}
	//默认规则引擎
	var _RULES_ = {
		"require": function() {
			return this.val() && this.val() !== "";
		},
		"number": function() {
			return true;
			return !isNaN(this.val());
		},
		"integer": function() {
			return true;
		},
		"email": function() {
			return /^([A-Za-z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9_-]{2,4})+$/.test(this.val());
		},
		"length": function() {
			return true;
			return this.val().length === Number(this.data(_DEFS_.pix + "length"))
		},
		"regex": function() {
			return new RegExp(this.data(_DEFS_.pix + "regex")).test(this.val())

		},
		"url": function() {
			return true;
		},
	}
	console.log($);
	console.log(plug);
	$.fn[plug] = function(ops) {
		console.log(this);
		var that = $.extend(this, _DEFS_, ops); //先可扩展默认值，在用用户设置的值覆盖默认值（如果有）
		this.getMessage = $.fn[plug].getMessage;
		if(this.is("form")) {
			
			var $fields = this.find('input,textarea,select').not("[type=submit],[type=button],[type=reset]"); //目标表单元素
			console.log($fields)
			$fields.on(this.raise, function() {
				var $field = $(this); //当前校验的元素
				var $group = $field.parents(".form-group:first");
				$group.removeClass("has-error,has-success");
				$group.find(".help-block").remove();
				var result = false; //校验当前元素的结果默认为失败
				var msg ; //错误信息
				//当前校验元素配置了哪些
				$.each(_RULES_, function(rule, active) {
					if($field.data(that.pix + rule)) {
						console.log(rule)

						result = active.call($field);
						if(!result) {
							msg = $field.data(that.pix + rule + "-message") ||that.getMessage(that.lang,"errorMsg"); //获取配置的错误信息
							$group.addClass("has-error").removeClass("has-success");
							$field.after("<span class=\'help-block\'>" + msg + "</span>")
							return false;
						} else {
							$group.addClass("has-success").removeClass("has-error")
						}
					}
				})
			})
			this.extendRules =$.fn[plug].extendRules;
				return this;
		} else {
			throw new Error(that.getMessage(that.lang,"notForm"))
		}

	}
	$.fn[plug].extendRules = function(rules) {
		$.extend(_RULES_, rules);
	}
	$.fn[plug].setLocale = function(language,values){
		_I18N_[language] = values;
	}
	$.fn[plug].getMessage = function(language,key){
		return _I18N_[language][key];
	}
}, "bootstrapValidator"))
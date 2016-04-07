import Utils from './utils';

class Validation {
    constructor(form, param) {
        this.form = form.jquery?form:$(form);
        this.params = {};
        this.validFun = {};
        this.errorList = {};
        this.fucError = {};
        this.initFormParams = {};
        this.param = $.extend({}, param);
        this.init();
    }

    init() {
        var formDom = this.form,
            V = this;
        var inputs = $(":input,textarea,select", formDom).not("button");
        V.initFormParams = V.getParams();

        $("textarea[maxlength]", formDom).each(function (i, n) {
            Utils.addSizeTip(n);
        });

        $(":text[checknum]", formDom).each(function (i, n) {
            Utils.checkNum(n);
        });

        if (V.param.valids) {
            for (var i = 0; i < V.param.valids.length; i++) {
                var validFun = V.param.valids[i];
                for (var j = 0; j < validFun.required.length; j++) {
                    var name = validFun.required[j];
                    var nameToFunList = V.validFun[name];
                    if (!nameToFunList) {
                        V.validFun[name] = [];
                    }
                    V.validFun[name].push(validFun);
                }
            }
        }
        inputs.filter("select").on("change input",function(event){
            if (!formDom.data("valid")) {
                return false;
            }
            let _this = $(this);
            _this.removeClass("error");
            V.validElement(_this);
        });

        inputs.on("focus", function(event){
            var _n = $(this);
            if (_n.hasClass("error")) {
                _n.removeClass("error");
            }
        });

        inputs.on("blur", function(event){
            if (!formDom.data("valid")) {
                return false;
            }
            V.validElement($(this));
        });
    }

    isChanged() {
        var V = this,
            params = V.getParams(),
            result = false;
        $.each(V.initFormParams, function (i, n) {
            // console.log(i);
            // console.log(params[i]!=undefined&&params[i]==n);
            if (!(params[i] !== undefined && params[i] == n)) { //不相等
                result = true;
                return false;
            }
        });
        // console.log(result);
        return result;
    };

    getParams() {
        var V = this,
            params = {},
            formDom = this.form;
        $(":input,textarea,select", formDom).not(":button,button").each(function (i, n) {
            V.setUpParams(n, params);
        });
        return params;
    };

    setUpParams(n, params) {
        var _n = $(n),
            _name = n.name;
        if (!_name) return false;
        var isSplit = _n.attr("data-type") == "split";
        var isList = _n.attr("data-type") == "list";
        if (isSplit) {
            var tags = n.value.split(/,|，/);
            params[_name] = [];
            for (var i = 0; i < tags.length; i++) {
                if (tags[i].trim() !== "") params[_name].push(tags[i]);
            }
        }
        else if (isList) {
            if (!params[_name])
                params[_name] = [];
            if (n.value !== "")
                params[_name].push(n.value);
        }
        else {
            params[_name] = _n.val();
        }
    };

    valid() {
        var isValid = true,
            V = this;
        var formDom = this.form;
        var inputs = $(":input,textarea,select", formDom).not(":button,button");
        $(".error").removeClass("error");
        $("span.error").remove();
        V.params = {};
        inputs.each(function (i, n) {
            var _n = $(n);
            if (n.name && !V.validElement(_n)) {
                //滚动条定位至第一个错误对象
                if(isValid){
                    $("body").scrollTop(_n.offset().top-10);
                }
                isValid = false;
            }
        });

        formDom.data("valid", true);
        return {
            params: V.params,
            isValid: isValid,
            errors: V.errorList
        };
    };

    validElement(_n) {
        var V = this,
            n = _n.get(0),
            _name = n.name;
        if (!_name) return true;
        var isRequired = _n.attr("required");
        V.fucError[_name] = null;
        var validResult = true;

        if (_n.attr("required") && !_n.val()) {
            _n.addClass("error");
            //第一个报错的focus
            // if(validResult)_n.focus();

            delete V.params[_name];
            V.errorList[_name] = true;

            validResult = false;
        }
        else {
            delete V.errorList[_name];
            V.setUpParams(n, V.params);
        }

        if (V.validFun[_name]) {
            for (var k = 0; k < V.validFun[_name].length; k++) {
                var validFun = V.validFun[_name][k];
                if (!validResult) {
                    var tipSpan = $("[from='tip-" + validFun.loc + "']", V.form);
                    tipSpan.remove();
                    for (var g = 0; g < validFun.required.length; g++) {
                        var $name = validFun.required[g];
                        if (V.params[$name] !== undefined && $name != _name) {
                            $("[name='" + validFun.required[g] + "']", V.form).removeClass("error");
                            delete V.fucError[validFun.loc];
                            delete V.errorList[$name];
                        }
                    }
                    continue;
                }
                //当需要一起判断的内容为空时，暂时不验证此错误
                for (var q = 0; q < validFun.required.length; q++) {
                    if (V.params[validFun.required[q]] === undefined) {
                        return true;
                    }
                }

                if (typeof validFun.premise == "string") {
                    validFun.premise = [validFun.premise];
                }
                for (var u = 0; u < (validFun.premise || []).length; u++) {
                    //如果在此类验证前面的验证未通过，则暂时不验证
                    if (V.fucError[validFun.premise[u]]) {
                        return true;
                    }
                }

                if (typeof validFun.func == "function") {
                    var result = validFun.func(V.form, V.params);
                    var tipSpan1 = $("[from='tip-" + validFun.loc + "']", V.form);
                    if (!result) {
                        if (tipSpan1.size() === 0 && validFun.tips) {
                            // console.log($("[tips='"+validFun.loc+"']",V.form));
                            $("[tips='" + validFun.loc + "']", V.form).append("<span class='errorTip' from='tip-" + validFun.loc + "'>" + validFun.tips + "</span>");
                        }
                        for (var w = 0; w < validFun.required.length; w++) {
                            var $name1 = validFun.required[w];
                            $("[name='" + $name1 + "']", V.form).addClass("error");
                            V.fucError[validFun.loc] = true;
                            V.errorList[$name1] = true;
                        }
                        // delete V.params[_name];
                        validResult = false;
                    }
                    else if (tipSpan1.size() > 0) {
                        tipSpan1.remove();
                        for (var t = 0; t < validFun.required.length; t++) {
                            var $name2 = validFun.required[t];
                            if (V.params[$name2] !== undefined) {
                                $("[name='" + validFun.required[t] + "']", V.form).removeClass("error");
                                delete V.fucError[validFun.loc];
                                delete V.errorList[$name2];
                            }
                        }
                    }
                }

            }

        }
        return validResult;
    };



}

export default Validation;
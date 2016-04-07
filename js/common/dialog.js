import G from './global'

const Default = {
    title: "",
    content: "",
    buttons: [],
    closeButtonName: "关闭",
    TopCloseButton: true,
    hasFooter: true
};

class Dialog {
    constructor(param) {
        let _d = this;
        param = this.param = $.extend({},Default,param, true);
        var html = `<div class="mate"><div><div class="box">`;
        if (param.TopCloseButton) html += '<span class="close icon-close"></span>';
        if (param.title) html += `<header>${param.title}</header>`;
        html += '<div class="dialog_content"></div>';

        if (param.hasFooter) {
            var footeHtml = "";
            if(param.button){
                if (!(param.button instanceof Array)) {
                    param.button = [param.button];
                }
                for (var i = 0; i < param.button.length; i++) {
                    footeHtml += "<button tag='" + i + "'>" + param.button[i].title + "</button>";
                }
            }
            if (param.closeButtonName) footeHtml += `<button class="button cancel closeButton">${param.closeButtonName}</button>`;
            html += `<footer>${footeHtml}</footer>`;
        }

        html += "</div></div></div>";

        let $body = $(html),
            _content = $(".dialog_content", $body),
            _box = $(".box", $body);
        _d.$body = $body;
        // if(param.content.jquery){//jquery对象插入使用js方法
        _content.append(param.content);
        // }

        $("body").append($body);
        if (param.width) {
            _box.css("width", param.width + "px");
        }
        if (param.height) {
            _content.css("height", param.height + "px");
        }
        if (param.maxheight) {
            _content.css("max-height", param.maxheight + "px");
        }

        $(".close,footer .closeButton", $body).on("click", function(){
            _d.close();
        });

        if (param.button) {
            $("footer button[tag]", $body).on("click", function () {
                var tag = parseInt($(this).attr("tag"), 10);
                if (typeof param.button[tag].func == "function")
                    param.button[tag].func($body);
            });
        }
        $body.fadeIn();
        $body.children("div").animate({
            top: "50%"
        }, 400);
        if (typeof param.initFunc == "function") {
            param.initFunc($body);
        }
        if (param.timeout) {
            window.setTimeout(function(){
                _d.close();
            }, timeout);
        }
    }

    close() {
        var $body = this.$body;
        $body.fadeOut().children("div").animate({
            top: "0"
        }, 400, function () {
            $body.remove();
        });
    };
}

export default Dialog;



(function (window) {
    // if(top!=window&&top.UI){
    //     window.UI = top.UI;
    //     return;
    // }
    window.UI = {
        Alert: {
            show: function (message, timeout) {
                var api = this;
                timeout = timeout || 3000;
                var $alert = $('<div class="alertDiv"><div class="alert"><p class="content"></p></div></div>');
                $(".content", $alert).text(message);
                $("body").append($alert);
                api.$ = $alert;
                $alert.show();
                if (timeout) {
                    window.setTimeout(UI.Alert.close, timeout);
                }
            },
            close: function () {
                UI.Alert.$.remove();
            }
        },
        HoverTip: function (obj, param) {
            if (typeof (obj) == "string")
                obj = $(obj);
            if (!obj.parent().hasClass("hoverTipParent")) {
                var parent = $("<div class='hoverTipParent'></div>");
                obj.wrap(parent);
            }
            var insertWord = function (param) {
                obj.next().remove();
                var hoverTip = $("<span class='hoverTipNew'>" + param.text + "<span class='triangle'></span></span>");
                obj.after(hoverTip);
                var csses = {};
                if (param.width) {
                    hoverTip.css("width", param.width + "px");
                }
                if (param.isCenter) {
                    csses.left = obj.width() / 2 - hoverTip.width() / 2 - 9 + "px";
                    $(".triangle", hoverTip).css("left", (hoverTip.width() / 2 + 2 + "px"));
                }
                if (param.classes) {
                    hoverTip.addClass(param.classes);
                }
                hoverTip.css(csses);
            }
            insertWord(param);
        },
        Tips: function (content, timeout) {
            timeout = timeout || 2000;
            content = content || "";
            var $tips = $('<div class="tips"><div><div class="content">' + content + '</div></div></div>');
            $("body").append($tips);
            $tips.css("margin-left", "-" + $tips.width() / 2 + "px");
            if (timeout != -1) {
                window.setTimeout(function () {
                    $tips.remove();
                }, timeout);
            }
            return $tips;
        },
        TopOver: function (content, timeout) {
            content = content || "";
            timeout = timeout || 10000;
            var $tips = $('<div class="top-over"><div><div class="content">' + content + '<span class="remove icon-close"></span></div></div></div>');
            $("body").append($tips);
            $tips.css("margin-left", "-" + $tips.width() / 2 + "px");
            $tips.on('click', '.remove', function () {
                $tips.remove();
            })
            if (timeout != -1) {
                window.setTimeout(function () {
                    $tips.remove();
                }, timeout);
            }
            return $tips;
        },
        Confirm: function (content, func) {
            return UI.Dialog.show({
                content: content || "",
                width: 300,
                closeTopButton: false,
                button: {
                    title: "确定",
                    func: function () {
                        if (typeof func == "function") {
                            func();
                        }
                    }
                }
            });
        },
        Validation: function (form, param) {
            var IValidation = function (form1, param) {
                this.form = form1;
                this.params = {};
                this.validFun = {};
                this.errorList = {};
                this.fucError = {};
                this.initFormParams = {};
                this.param = $.extend({}, param);
                this.init = function () {
                    // console.log(this);
                    var formDom = this.form,
                        V = this;
                    var inputs = $(":input,textarea,select", formDom);
                    V.initFormParams = V.getParams();

                    $("textarea[maxlength]", formDom).each(function (i, n) {
                        Utils.addSizeTip(n);
                    });

                    $(":text[checkNum]", formDom).each(function (i, n) {
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
                        // console.log(V.validFun);
                    }

                    inputs.on("focus", function (event) {
                        var _n = $(this);
                        if (_n.hasClass("error")) {
                            _n.removeClass("error");
                            // _n.prev().remove();
                        }
                    });
                    $(".selectPart", formDom).on("mouseenter", function (event) {
                        var _n = $(this);
                        if (_n.hasClass("error")) {
                            _n.removeClass("error");
                        }
                    });
                    $(".selectPart", formDom).on("mouseleave", function (event) {
                        if (!formDom.data("valid")) {
                            return false;
                        }
                        V.valid($(this).find("input:hidden"));
                    });

                    inputs.on("blur", function (event) {
                        if (!formDom.data("valid")) {
                            return false;
                        }
                        V.valid($(this));
                    });
                };


                this.isChanged = function () {
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

                this.getParams = function () {
                    var V = this,
                        params = {},
                        formDom = this.form;
                    $(":input,textarea,select,.selectPart>input:hidden", formDom).not(":button,button").each(function (i, n) {
                        V.setUpParams(n, params);
                    });
                    return params;
                };

                this.setUpParams = function (n, params) {
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
                        params[_name] = n.value;
                    }
                };

                this.getValid = function () {
                    var isValid = true,
                        V = this;
                    var formDom = this.form;
                    var inputs = $(":input,textarea,select,.selectPart>input:hidden", formDom).not(":button,button");
                    $(".error").removeClass("error");
                    $("span.error").remove();
                    V.params = {};
                    inputs.each(function (i, n) {
                        var _n = $(n);
                        if (n.name && !V.valid(_n)) {
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

                this.valid = function (_n) {
                    var V = this,
                        n = _n.get(0),
                        _name = n.name;
                    if (!_name) return true;
                    var isRequired = _n.attr("required");
                    V.fucError[_name] = null;
                    var validResult = true;

                    if (_n.attr("required") && _n.val().trim() === "") {
                        if (_n.attr("type") == "hidden" || _n.parent().hasClass("selectPart")) {
                            _n.parent().addClass("error");
                        }
                        else {
                            _n.addClass("error");
                        }
                        delete V.params[_name];
                        V.errorList[_name] = true;

                        validResult = false;
                        // var tips = _n.attr("tips")==undefined?(_n.attr("placeholder")+"必填"):_n.attr("tips");
                        //.before("<span class='right error'>"+tips+"</span>");
                    }
                    else {
                        delete V.errorList[_name];
                        // console.log(n);
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

                this.init();
            };
            return new IValidation(form, param);
        },
        SelectUI: {
            getSelectHtml: function (param) {
                param = $.extend({
                    name: "",
                    data: [],
                    classes: ""
                }, param);
                if (param.data.length > 0 && typeof param.data[0] != "object") {
                    var newList = [];
                    for (var i = 0; i < param.data.length; i++) {
                        newList.push({
                            name: param.data[i],
                            value: param.data[i]
                        });
                    }
                    param.data = newList;
                }

                var html = '<div><div class="selectPartDiv"><div class="selectPart hasIcon ${classes}" type="${name}"> <input name="${name}" type="hidden" required/><div class="showValue">请选择</div><div class="content"><ul class="list"> {{each data}} <li value=${$value.value}>${$value.name}</li>{{/each}} </ul> </div> </div></div></div>';
                var jObj = $(html).tmpl(param);
                if (param.nowValue !== undefined) {
                    $("input:hidden", jObj).val(param.nowValue);
                    var selected = $(".list>li[value='" + param.nowValue + "']", jObj).addClass("selected");
                    $(".showValue", jObj).text(selected.text());
                }
                return jObj;
            },
            getDegreeHtml: function (data) {
                var html = '<div><div class="selectPartDiv"><div class="selectPart hasIcon" type="degreeLevel"> <input name="degreeLevel" type="hidden" required/><div class="showValue">请选择</div><div class="content"><ul class="list"> {{each degrees}}<li value="${value}">${name}</li>{{/each}} </ul> </div> </div></div></div>';
                return $(html).tmpl({
                    degrees: data
                });
            },
            getCatagoryHtml: function (data) {
                var html = '<div><div class="selectPartDiv"><div class="selectPart hasIcon" type="category"> <input name="category" type="hidden" required/><div class="showValue">请选择</div><div class="content"><ul class="list"> {{each professions}}<li>${$value}</li>{{/each}} </ul> </div> </div></div></div>';
                return $(html).tmpl(data);
            },
            setValue: function (selectDiv, value) {
                var _selectDiv = $(selectDiv);
                var inputs = _selectDiv.children(":hidden");
                value = value || inputs.val();
                if (value == undefined) {
                    $(".list li:first", selectDiv).trigger("click", {
                        quiet: true
                    });
                }
                else if (typeof value == "object") {

                }
                else {
                    $(".list li[value='" + value + "'],.list li:contains('" + value + "')", selectDiv).eq(0).trigger("click", {
                        quiet: true
                    });
                }
            },
            initSelectEvent: function (content, param) {
                param = $.extend({
                    selectFirst: true
                }, param || {});
                content = content || $("body");
                $(".selectPart", content).on("mouseenter mouseleave", function (event) {
                    var _this = $(this);
                    var _content = $(".content", this);
                    if (_content.size() == 0) return false;
                    if (event.type == "mouseenter") {
                        _content.stop().slideDown(100);
                        _this.addClass("hover");
                    }
                    else {
                        _content.stop().slideUp(100, function () {
                            _this.removeClass("hover");
                        });
                    }
                });

                $(".selectPart", content).on("click", function (event, param) {
                    var target = event.target,
                        _target = $(target),
                        _this = $(this);
                    var min = $(".input :input.min", _this),
                        max = $(".input :input.max", _this),
                        _showValue = $(".showValue", _this),
                        inputs = _this.children(":hidden");
                    if (target.tagName == "LI") {
                        _this.find("li.selected").removeClass("selected");
                        _showValue.text(_target.text());
                        _target.addClass("selected");

                        if (inputs.size() > 0) {
                            if (_target.attr("min") != undefined || _target.attr("max") != undefined) {
                                inputs.filter("[ref-val='min']").val(_target.attr("min"));
                                inputs.filter("[ref-val='max']").val(_target.attr("max"));
                            }
                            else if (_target.attr("value") !== undefined) {
                                inputs.val(_target.attr("value"));
                            }
                            else {
                                inputs.val(_target.text());
                            }
                        }

                        min.val("");
                        max.val("");
                    }
                    else if (target.tagName == "BUTTON") {
                        var minV = min.val(),
                            maxV = max.val();
                        if (minV === "" && maxV === "") {
                            return false;
                        }
                        var suffix = _showValue.attr("ref-postfix");
                        var textS = "";
                        _this.find("li.selected").removeClass("selected");

                        if (minV === "") {
                            textS = "0 - " + maxV + suffix;
                        }
                        else if (maxV === "") {
                            textS = minV + suffix + "以上";
                        }
                        else if (parseInt(minV, 10) > parseInt(maxV, 10)) {
                            min.val(maxV);
                            max.val(minV);
                        }

                        textS = textS || min.val() + " - " + max.val() + suffix;
                        $(".showValue", _this).text(textS);

                        inputs.filter("[ref-val='min']").val(min.val());
                        inputs.filter("[ref-val='max']").val(max.val());
                    }
                    else {
                        return false;
                    }
                    if (param && param.quiet) return false;
                    _this.trigger("mouseleave");
                    _this.trigger("valueSet");
                });

                if (param.selectFirst) {
                    $(".selectPart", content).each(function (i, n) {
                        UI.SelectUI.setValue(n);
                    });
                }
            }
        }
    };

})(window);
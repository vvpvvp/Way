
export default {
    isObject(input) {
        return Object.prototype.toString.call(input) === '[object Object]';
    },
    isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    },
    isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    },
    isNumber(input) {
        return input instanceof Number || Object.prototype.toString.call(input) === '[object Number]';
    },
    isString(input) {
        return input instanceof String || Object.prototype.toString.call(input) === '[object String]';
    },
    isFunction(input){
        return typeof input == "function";
    },
    toObject: function (list, idName, hasNum) {
        hasNum = hasNum === undefined ? false : hasNum;
        idName = idName === undefined ? "id" : idName;
        var listO = {};
        $.each(list, function (i, n) {
            listO[n[idName]] = n;
            if (hasNum) {
                listO[n[idName]].count = i;
            }
        });
        return listO;
    },
    wordBreak: function (s) {
        console.log(s);
        return s.replace(/\r\n/g, "<BR/>").replace(/\n/g, "<BR/>");
    },
    checkNum: function (input) {
        var _input = $(input);
        _input.on("paste", function (event) {
            event.preventDefault();
            return false;
        });
        _input.on("input propertychange", function (event) {
            var _this = $(this);
            if (/^[0-9]*$/.test(this.value)) {
                _this.data("oldvalue", this.value);
            }
            else {
                this.value = _this.data("oldvalue") || "";
            }
        });
    },
    checkSize: function (input) {
        var _input = $(input);
        var size = parseInt(_input.attr("maxlength"), 10);
        if (typeof size == "number") {
            _input.on("keypress", function (event) {
                if (this.value.length == size) {
                    event.preventDefault();
                    return false;
                }
            });
            _input.on("paste input propertychange", function (event) {
                if (this.value.length > size) {
                    this.value = this.value.substr(0, size);
                }
            });
        }
    },
    addSizeTip: function (input) {
        var _input = $(input);
        if (_input.size() === 0) return false;
        var size = parseInt(_input.attr("maxlength"), 10);
        _input.removeAttr("maxlength").attr("sysmaxlength", size);
        _input.wrap("<div class='textareaInputDiv'></div>");
        _input.after("<p class='textareaInputLeftWord gray font12'>还可以输入<span class='highlight2'>" + (size - _input.val().length) + "</span>字</p>");

        if (typeof size == "number") {
            _input.on("keypress", function (event) {
                var inputSize = parseInt($(this).attr("sysmaxlength"), 10);
                if (event.charCode !== 0 && this.value.length == inputSize) {
                    event.preventDefault();
                    return false;
                }
            });
            _input.on("paste input", function (event) {
                var inputSize = parseInt($(this).attr("sysmaxlength"), 10);
                if (this.value.length > inputSize) {
                    this.value = this.value.substr(0, inputSize);
                }
                $(this).next().find("span").text(inputSize - this.value.length);

            });
        }
    },
    encodeHtml: function (s) {
        return (typeof s != "string") ? s :
            s.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
                function ($0) {
                    var c = $0.charCodeAt(0),
                        r = ["&#"];
                    c = (c == 0x20) ? 0xA0 : c;
                    r.push(c);
                    r.push(";");
                    return r.join("");
                });
    },
    getURLParam: function (name, search) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(search || location.search) || [true, ""])[1].replace(/\+/g, '%20')) || null;
    },
    status: {},
    clearStatus: function (param) {
        this.status = {};
    },
    getStatus: function (param) {
        return this.status[param] || false;
    },
    setTrue: function (param) {
        this.status[param] = true;
    },
    setFalse: function (param) {
        this.status[param] = false;
    },
    setStatus: function (param, value) {
        this.status[param] = value;
    },
    initPageParam: function (param) {
        if (param === undefined || typeof (param) == "number") {
            return {
                page: 0,
                size: param || 20,
                total: 0,
                total_page: 0,
                totalPages: 0
            };
        }
        else {
            arguments[0].page = arguments[1].page;
            arguments[0].size = arguments[1].size;
            arguments[0].total = arguments[1].total;
            arguments[0].total_page = arguments[1].total_page;
            arguments[0].totalPages = arguments[1].totalPages;
        }
    },
    identifyUrl: function (s) {
        s = s === undefined ? "" : s;
        var re = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;
        var new_s = s.replace(re, function (word) {
            // console.log(word);
            var link = word;
            if (!/^(http|ftp|https):\/\//.test(word)) {
                link = "http://" + word;
            }
            return "<a href='" + link + "' target='_blank'>" + word + "</a>";
        });
        return new_s;
    }
};


//fixed 固定上下，不固定左右，class="upDownfixed"的对象
// $(function() {
//     $(window).on("scroll", function() {
//         $(".upDownfixed").each(function(i, n) {
//             var _n = $(n);
//             if (_n.data("left") === undefined) {
//                 _n.data("left", _n.position().left);
//             }
//             // console.log(_n.position().left);
//             var windowLeft = $(window).scrollLeft();
//             if (windowLeft === 0) {
//                 _n.css("left", "inherit");
//                 _n.data("left", _n.position().left);
//             } else {
//                 _n.css("left", (_n.data("left") - windowLeft + "px"));
//             }
//         });
//     });
// });
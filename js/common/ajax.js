let ajax = {
    PREFIX:"",
    getJson: function(url, data, callback) {
        var  type = "json";
        if ( $.isFunction( data ) ) {
            callback = data;
            data = undefined;
        }
        // The url can be an options object (which then must have .url)
        url = this.PREFIX + url;

        return $.ajax({
            url: url,
            type: "GET",
            cache:false,
            dataType: type,
            data: data,
            success: callback
        });
    },
    get: function(url) {
        var params = {};
        params.url = url;

        params.type = "GET";
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (typeof arg == "function") {
                if (params.success) {
                    params.error = arg;
                } else {
                    params.success = arg;
                }
            } else if (typeof arg == "string") {
                params.dataType = arg;
            } else if (typeof arg == "object") {
                params.data = arg;
            }
        }
        return w.J.ajax(params);
    },
    post: function(url) {
        var params = {};
        params.url = url;
        params.type = "POST";
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (typeof arg == "function") {
                if (params.success) {
                    params.error = arg;
                } else {
                    params.success = arg;
                }
            } else if (typeof arg == "string") {
                params.dataType = arg;
            } else if (typeof arg == "object") {
                params.data = arg;
            }
        }
        return w.J.ajax(params);
    },
    postJson: function(url, param1, paramJson, successFuc, failureFuc, dataType) {
        return w.J.ajax({
            url: url + ("?".indexOf(url) == -1 ? "?" : "&") + $.param(param1),
            type: "post",
            data: JSON.stringify(paramJson),
            contentType: "application/json;charset=UTF-8",
            processData: false,
            dataType: dataType || "json",
            success: successFuc,
            error: failureFuc
        });
    },
    patchJson: function(url, param1, paramJson, successFuc, failureFuc, dataType) {
        return w.J.ajax({
            url: url + ("?".indexOf(url) == -1 ? "?" : "&") + $.param(param1),
            type: "patch",
            data: JSON.stringify(paramJson),
            contentType: "application/json;charset=UTF-8",
            processData: false,
            dataType: dataType || "json",
            success: successFuc,
            error: failureFuc
        });
    },
    deleteAjax: function(url, successFuc) {
        return w.J.ajax({
            url: url,
            type: "delete",
            dataType: "json",
            success: successFuc
        });
    },
    ajax: function(params) {
        params.url = this.PREFIX + params.url;
        return $.ajax(params);
    },
    getContextPath: function() {
        var pathName = document.location.pathname;
        var index = pathName.substr(1).indexOf("/");
        var result = pathName.substr(0, index + 1);
        return result;
    },
    setSetup: function() {
        $.ajaxSetup({
            headers: {
                // "X-UFish-Authorization": "Basic " + D.getData(C.cookieToken),
                // "X-UFish-Source": "Server,Web/" + G.version
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (this.success){
                    this.success({
                        status: -1,
                        desc: "通讯异常"
                    });
                }else if (this.done){
                    this.done({
                        status: -1,
                        desc: "通讯异常"
                    });
                }
            },
            complete: function(XMLHttpRequest, textStatus) {
                try {
                    var result = jQuery.parseJSON(XMLHttpRequest.responseText);
                } catch ( e ) {
                    console.error(e);
                }
            },
            statusCode: {
                400: function() {
                    console.log(400);
                },
                404: function() {
                    console.log(404);
                },
                401: function() {
                    console.log(401);
                }
            }
        });
    }
};

ajax.setSetup();

export default ajax;
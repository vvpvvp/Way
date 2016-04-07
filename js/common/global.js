// import Common from "../common"
const G = {
    devVersion: "1.5.5",
    prodVersion: "1.5.5",
    IE9: navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0",
    SAFARI: !!window.safari,
    dev: {
        host: "gongzuojihui.com"
    },
    prod: {
        host: ["jihui.io", "ufish.io"]
    },
};


var host = window.location.host;
G.isDev = !(host.indexOf(G.prod.host[0]) > -1 || host.indexOf(G.prod.host[1]) > -1);

G.version = G.isDev ? G.devVersion : G.prodVersion;
Object.freeze(G);
// Common.Log("当前环境：" + (G.isDev ? "测试环境" : "正式环境"));
// Common.Log("版本号：" + G.version);

//正式环境做统计
// if (!G.isDev) {
//     var _hmt = _hmt || [];
//     ( function() {
//         var hm = document.createElement("script");
//         hm.src = "//hm.baidu.com/hm.js?16618e361b00e48a9b398ef2177f90e8";
//         var s = document.getElementsByTagName("script")[0];
//         s.parentNode.insertBefore(hm, s);
//     } )();
// }

export default G;

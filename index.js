import template from "./js/template";
import Handlebars from "handlebars/dist/handlebars";

var temp = Handlebars.compile(template.userInfo);
console.log(temp({a:"测试"}));
console.log(1);
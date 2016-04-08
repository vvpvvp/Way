import Map from '../plugin/map';
import Handlebars from "handlebars/dist/handlebars";
import template from "../template";
class Control{
	constructor(){
		// this.container = $(container);
		this.data = {};
		this.init();
	}

	init(){
		let C = this;
		// $(document).on("mousewheel",function(event){
			
		// });

		this.getData();

		$(window).on("resize",C.onResize);
		C.onResize();
	}

	getData(){
		let C = this;
		Common.A.get("/data/ways.json",(result)=>{
			if(result.status==1){
				C.data = result;
		        let travelInfoTemp = Handlebars.compile(template.indexInfo);
		        $('.container').append(travelInfoTemp(C.data));
			}
		});
	}

	onResize(){
		$(".header").height($(window).height());
	}
}

let getControl = ()=>{
	return new Control();
}
export default getControl;

// <defs xmlns="http://www.w3.org/2000/svg">
// <linearGradient id="orange_red" x1="0%" y1="0%" x2="100%" y2="0%">
// <stop offset="0%" style="stop-color: #ffc663;stop-opacity:1;"></stop>
// <stop offset="100%" style="stop-color:#34ebde;stop-opacity:1"></stop>
// </linearGradient>
// </defs>
import Map from '../plugin/map';

class Control{
	constructor(){
		// this.container = $(container);
		this.init();
	}

	init(){
		
		// $(".header").height($(window).height());
		$(document).on("mousewheel",function(event){
			
		});
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
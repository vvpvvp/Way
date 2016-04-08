import Map from '../plugin/map';

class Control{
	constructor(){
		// this.container = $(container);
		this.init();
		// this.x = 0
	}

	init(){

		$("#mapContainer").on("mousewheel",function(event){
			let isUp = event.deltaY<0,isDown = !isUp;
			// console.log(`isUp:${isUp}`);
			$("body").scrollTop(document.body.scrollTop-event.deltaY*3);
			event.preventDefault();
		});
	}
}

let getControl = ()=>{
	return new Control();
}
export default getControl;
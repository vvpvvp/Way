class Control{
	constructor(){
		// this.container = $(container);
		this.init();
	}

	init(){
		$(document).on("mousewheel",function(event){
			
		});
	}
}

let getControl = ()=>{
	return new Control();
}
export default getControl;
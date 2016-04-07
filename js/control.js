class Control{
	constructor(container){
		this.container = $(container);
		thisl.init();
	}

	init(){
		
	}
}

let getControl = (container){
	return new Control(container);
}
export default getControl;
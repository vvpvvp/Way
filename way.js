import control from './js/way/control';

if(WEBPACK_DEBUG){
	Common.U.loadCss("css/way.css");
}else{
	require("../css/way.css");
}

$(()=>{
	control();
})

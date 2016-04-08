import control from './js/index/control';

if(WEBPACK_DEBUG){
	Common.U.loadCss("css/index.css");
}else{
	require("./css/index.css");
}

$(()=>{
    control();
})

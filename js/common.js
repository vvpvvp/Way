import Glolal from './common/global';
import Ajax from './common/ajax';
import Utils from './common/utils';

if(WEBPACK_DEBUG){
	Utils.loadCss("/css/common.css");
}else{
	require("../css/common.css");
}

module.exports = {
    G: Glolal, A: Ajax, U: Utils
};
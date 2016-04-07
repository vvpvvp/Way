import initMap from './js/map';
require('./css/way.css');
$(()=>{
	initMap('mapContainer');
	$(document).on("mousewheel",function(event){
		
	});
})

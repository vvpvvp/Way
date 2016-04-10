import Map from '../plugin/map';
import Handlebars from "handlebars/dist/handlebars";
import template from "../template";
import moment from "momentjs";
import Vivus from "vivus";
class Control{
	constructor(){
		// this.container = $(container);
		this.data = {};
		this.init();
	}

	init(){
		let C = this;
		new Vivus('header_icon', {type: 'delayed',
			    duration: 200,
			    animTimingFunction: Vivus.EASE,
			    file: '/images/badge.svg'});

		
		new Vivus('footer_icon', {type: 'delayed',
			    duration: 200,
			    animTimingFunction: Vivus.EASE,
			    file: '/images/footer.svg'});

		
		// $(document).on("mousewheel",function(event){
			
		// });
		// $("#header_icon").tooltipster({content:"测试"});


		this.getData();

		$(window).on("resize",C.onResize);
		C.onResize();
	}



	dealData(){
		let C = this;

		for(let data of C.data.content){
			let content = data.way;
			content.start = content.onway[0];
			content.end = content.plan[content.plan.length-1];
			let startDate = moment(content.startDate);
			content.startDateShow = {
				month:startDate.month()+1,
				date:startDate.date(),
				year:startDate.year()
			};
			content.now = content.onway[content.onway.length-1];

			for(let [i,w] of content.onway.entries()){
				if(i!=content.onway.length-1){
					delete w.location;
				}
			}

			for(let [i,w] of content.plan.entries()){
				if(i!=content.plan.length-1&&i!=0){
					delete w.location;
				}
			}
		}
	}

	drawPoly(i,data){
		let C = this;

		let content = data.way;
		let mapDom = $("#mapContainer_" + i);

		let map = new Map(mapDom.attr("id"),content);
		// let drawPoly = map.drawPolyline(content.plan,Map.GREY);
		// map.drawPolyline(content.onway,Map.COLORFUL);
		// map.focus(drawPoly);
		// $(".leaflet-marker-icon").tooltipster();
	}

	getData(){
		let C = this;
		Common.A.get("data/ways.json",(result)=>{
			if(result.status==1){
				C.data = result;
				C.dealData();
		        let travelInfoTemp = Handlebars.compile(template.indexInfo);
		        $('.container').append(travelInfoTemp(C.data));

				for(let [i,data] of C.data.content.entries()){
					C.drawPoly(i,data);
				}
			}
		});
	}

	onResize(){
		let _h = $(window).height();
		$(".header").height(_h).css("font-size",(_h/700+"em"));
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

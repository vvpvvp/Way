import Map from '../plugin/map';
import Handlebars from "handlebars/dist/handlebars";
import template from "../template";
import moment from "momentjs";
// require("../../css/animate.min.css");
class Control{
	constructor(){
		// this.container = $(container);
		this.data = {};
		this.init();
		this.status = {isMoveing:false};
		this.index=-1;
		this.page = null;
		//momentInfo_
		this.canMouse = false;
		// this.x = 0
	}

	init(){
		
		let C = this;
		$("body").on("mousewheel",function(event){
			if(event.deltaY==0||C.status.isMoveing)return false;
			let isUp = event.deltaY<0,isDown = !isUp;
			let pos = C.getScrollPostion();
			// console.log(isUp,pos.isTop);
			if(pos.isBottom&&isUp&&C.data.way.onway.length-1>C.index){
				C.index++;
				C.togglePage(C.page,$("#momentInfo_"+C.index),"up");
			}else if(isDown&&pos.isTop){
				if(C.index>0){
					C.index--;
					C.togglePage(C.page,$("#momentInfo_"+C.index),"down");
				}else if(C.index==0){
					C.index--;
					C.togglePage(C.page,$(".userInfo"),"down");
				}
			}
		});
		this.getData();
	}

	togglePage(from,to,type){
		let C = this;
		C.hideMouse();
		C.status.isMoveing = true;
		// C.doms.container.css("overflow-y","hidden");
		from.addClass("transform from-start "+type);
		to.addClass("show transform to-start "+type);
		to.scrollTop(0);
		C.page = to;
		setTimeout(function() {
			from.addClass("from-end");
			to.addClass("to-end");
		}, 0);
		setTimeout(function() {
			C.status.isMoveing = false;
			from.removeClass("show transform from-start from-end "+type);
			to.removeClass("transform to-start to-end "+type);
			from.scrollTop(0);
			C.loadImages();
			C.getScrollPostion();
		}, 1*1000);
	}

	loadImages(){
		let C = this;
		$(".images img",C.page).each(function(i,n){
			let _n = $(n);
			if(!_n.data("havepic")){
				n.src = _n.attr("vsrc");
				// _n.css("background-image","url("+_n.attr("src")+")");
				_n.data("havepic",true);
			}
		});
	}

	getScrollPostion(y){
		y = y||0;
		let C = this;
		let isTop = false,isBottom = false;
		let scrollTop = C.page.scrollTop();
		let _h = C.page.height();
		let _bodyHeight = C.page.children().height();
		let _y = (_bodyHeight)-(scrollTop+_h);
		let isPageDown = _y<110;
		isTop = scrollTop == 0;
		isBottom = _h>=_bodyHeight||_y==0;
		if(isPageDown){
			C.showMouse();
		}else{
			C.hideMouse();
		}

		return {isTop,isBottom,isPageDown,y:scrollTop};
	}

	showMouse(){
		let C = this;
		if(C.canMouse)return false;
		C.doms.mouse.addClass('show');
		C.canMouse = true;
	}

	hideMouse(){
		let C = this;
		if(!C.canMouse)return false;
		C.doms.mouse.removeClass("show");
		C.canMouse = false;
	}

	dealData(){
		let C = this;
		let content = C.data.way;
		content.start = content.onway[0];
		content.end = content.plan[content.plan.length-1];
		// let startDateShow = moment(content.startDate).format("k");
		// content.startDateShow = {
		// 	month:startDate.month()+1,
		// 	date:startDate.date(),
		// 	year:startDate.year()
		// };


		for(let [i,w] of content.onway.entries()){

			w.startDateShow = moment(w.startDate).format("k");
			// if(i!=content.onway.length-1){
			// 	delete w.location;
			// }
		}

		for(let [i,w] of content.plan.entries()){
			if(i!=content.plan.length-1&&i!=0){
				delete w.location;
			}
		}

		content.now = content.onway[content.onway.length-1];
	}

	getData(){
		let C = this;
		Common.A.get("data/data.json",(result)=>{
			if(result.status==1){
				C.data = result.content;
				C.dealData();

		        let travelInfoTemp = Handlebars.compile(template.detailInfo);
		        $('#blog .container').append(travelInfoTemp(C.data));
		        C.doms = {
		        	mouse:$("#mouse-next"),
		        	container:$('#blog>.container')
		        };
				//初次执行；
				C.page = $(".userInfo");
				let pos = C.getScrollPostion();
				C.canMouse = !pos.isPageDown;
				if(pos.isPageDown){
					C.showMouse();
				}else{
					C.hideMouse();
				}
				// for(let [i,data] of C.data.content.entries()){
				// 	let content = data.way;
				// 	let mapDom = $("#mapContainer_" + i);

					let map = new Map("mapContainer");
					let drawPoly = map.drawPolyline(C.data.way.plan,Map.GREY);
					let drawPoly = map.drawPolyline(C.data.way.onway,Map.COLORFUL);
				// 	map.drawPolyline(content.onway,Map.COLORFUL);
				// 	map.focus(drawPoly);
				// 	$(".leaflet-marker-icon").tooltipster();
				// }
			}
		});
	}
}

let getControl = ()=>{
	return new Control();
}
export default getControl;
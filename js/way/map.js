import {initMap, drawPolyline} from '../plugin/map';
import template from "../template";
import Handlebars from "handlebars/dist/handlebars";


let map, polyline;

// class Map {
//     constructor(){
//         // this.container = $(container);
//         this.init();
//     }

//     formatCoords(data) {
//         var _coords = [];
//         for (var i = data.length - 1; i >= 0; i--) {['gps']
//             _coords.push(data[i]['gps']);
//         }
//         return _coords;
//     } 

//     init(){
//         let M = this;
//         $.get('data/data.json', function(res) {
//             map = initMap('mapContainer');
//             polyline = drawPolyline(map, M.formatCoords(res));
//             map.fitBounds(polyline);
//         });
//     }
// }

let M = function() {
    let map, polyline;

    function formatCoords(data) {
        var _coords = [];
        for (var i = data.length - 1; i >= 0; i--) {['gps']
            _coords.push(data[i]['gps']);
        }
        return _coords;
    } 

    $.get('data/data.json', function(res) {
        map = initMap('mapContainer');
        polyline = drawPolyline(map, formatCoords(res));
        map.fitBounds(polyline);
    });
}

export default M;

// let getMap = ()=>{
//     return new Map();
// }

// export default getMap;


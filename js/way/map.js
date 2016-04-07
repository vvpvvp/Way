import initMap from '../plugin/map';
import template from "../template";
import Handlebars from "handlebars/dist/handlebars";
let M = ()=>{
    let map, datas, ways = {};

    function bindEvents() {
        $(document).on('click', '.way', function() {
            $(event.target).siblings().removeClass('active');
            $(event.target).addClass('active');
            let id = $(event.target).attr('id');
            map.fitBounds(ways[id].getBounds());
        })
    }

    function drawWay(id, coords) {
        let polyline, points = [],
            point;
        for (var i = coords.length - 1; i >= 0; i--) {
            point = new L.LatLng(coords[i][1], coords[i][0]);
            console.log(coords[i][0] + ',' + coords[i][1]);
            points.push(point);
        }
        polyline = L.polyline(points, {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        }).addTo(map);

        ways[id] = polyline;
    }

    function drawMultipleWays(datas) {
        if (datas.length) {
            let i, history, recent, coords, id;

            for (i = datas.length - 1; i >= 0; i--) {
                history = datas[i]['history'];
                recent = history[history.length - 1];
                coords = recent['coords'];
                id = datas[i]['id'];
                drawWay(id, coords);
            }
            map.fitBounds(ways[id].getBounds());
        }
    }

    function renderTravelList(datas) {
        let travelInfoTemp = Handlebars.compile(template.travelInfo);
        $('body').append(travelInfoTemp({ datas: datas }));
    }

    bindEvents();

    $.get('data/ways.json', function(res) {
        datas = res;
        map = initMap('mapContainer');
        renderTravelList(datas);
        drawMultipleWays(datas);
    });

}

export default M;

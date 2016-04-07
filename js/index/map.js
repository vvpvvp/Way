import {initMap, drawPolyline} from '../plugin/map';
import template from "../template";
import Handlebars from "handlebars/dist/handlebars";
let M = ()=> {
    let map, datas, ways = {};

    function bindEvents() {
        $(document).on('click', '.way', function() {
            $(event.target).siblings().removeClass('active');
            $(event.target).addClass('active');
            let id = $(event.target).attr('id');
            map.fitBounds(ways[id].getBounds());
        })
    }

    function drawMultipleWays(datas) {
        if (datas.length) {
            let i, history, recent, coords, id;

            for (i = datas.length - 1; i >= 0; i--) {
                history = datas[i]['history'];
                recent = history[history.length - 1];
                coords = recent['coords'];
                id = datas[i]['id'];
                ways[id] = drawPolyline(map, coords);
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

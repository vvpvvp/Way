import {initMap, drawPolyline} from '../plugin/map';
import template from "../template";
import Handlebars from "handlebars/dist/handlebars";
let M = ()=> {
    let map, datas, ways = {};

    function bindEvents() {
        $(document).on('click', '.way', function() {
            let $way = $(event.target);

            if(!$(event.target).hasClass('way')) {
                $way = $way.parents('.way')
            }

            $way.siblings().removeClass('active');
            $way.addClass('active');
            let id = $way.attr('id');
            map.fitBounds(ways[id].getBounds());
        }).on('click', '.leaflet-marker-icon', function() {
            $('#floatTip').html($(event.target).attr('title'));
        })
    }

    function drawMultipleWays(datas) {
        if (datas.length) {
            let i, history, recent, coords, id, startEnd = [];

            for (i = datas.length - 1; i >= 0; i--) {
                history = datas[i]['history'];
                
                id = datas[i]['id'];
                recent = history[history.length - 1];

                // only draw recent one travel path                
                ways[id] = drawPolyline(map, recent, true);
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

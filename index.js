import Map from './js/plugin/map';
import control from './js/index/control';
require('./css/index.css');
$(()=>{

    // let datas = [
    //     {'gps': [118.398167, 31.353617], 'location': '成都'},
    //     {'gps': [117.32411, 31.891577],  'location': null},
    //     {'gps': [104.079853, 30.703257], 'location': null},
    //     {'gps': [104.060099, 30.674127], 'location': null},
    //     {'gps': [104.062428, 30.669304], 'location': null},
    //     {'gps': [104.084181, 30.660397], 'location': null},
    //     {'gps': [104.056404, 30.651792], 'location': null},
    //     {'gps': [104.080874, 30.651038], 'location': null},
    //     {'gps': [103.780031, 29.553095], 'location': '拉萨'}
    // ], style = 'red';

    // let map = new Map('mapContainer');
    // let polyline1 = map.drawPolyline(datas, Map.GREY);
    // map.focus(polyline1);
    
    control();
})

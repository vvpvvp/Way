let userInfo =
    ``;

let indexInfo =
    `
{{#each content}}
<div class="travelContainer">
    <div class="startDate">
    <p>{{way.startDateShow.month}}月&nbsp;&nbsp;{{way.startDateShow.date}}</p>
    <p>{{way.startDateShow.year}}</p></div>

    <div class="mapContainer" id="mapContainer_{{@index}}">
    </div>
    <div class="userInfo">
        <div class="userIcon">
            <span style="background-image:url({{basic.avatar}})"></span>
        </div>
        <p class="userName">{{basic.name}}</p>
        <p class="dark text-center font16">{{basic.age}}岁&nbsp;{{basic.profession}}</p>

        <p class="dark text-center font20">{{way.title}}</p>

        <p class="dark text-center font16">当前位置：&nbsp;{{way.now.location}}</p>
        <a href="way.html" class="greenButton">More</a>
    </div>
</div>
{{/each}}
`;

let timeLine = `
<div class="clear">
    {{#each days}}
            <span class="timeSeperate">{{showDate}}</span>
            {{#each data}}
            <span class="time" title="{{dateTime}} {{location}}" index="{{index}}"></span>
            {{/each}}
    {{/each}}
</div>
`;

let detailInfo =
    `
<div class="userInfo show">
    <div>
        <div class="userIcon">
            <span style="background-image:url({{basic.avatar}})"></span>
        </div>
        <p class="userName">{{basic.name}}</p>
        <p class="dark text-center font16">{{basic.age}}岁&nbsp;{{basic.profession}}</p>
        <p>&nbsp;</p>
        <p class="dark text-center font22">{{way.title}}</p>
        <p class="dark text-center font16">当前旅程</p>
        <p class=" text-center font18">{{way.start.location}}&nbsp;-&nbsp;{{way.end.location}}</p>

        <p class="dark text-center font16">当前位置</p>
        <p class=" text-center font18">{{way.now.location}}</p>
    </div>
</div>
{{#each way.onway}}
<div class="momentInfo" id="momentInfo_{{@index}}">
    <div>
    <div class="dark">{{dateShow}}&nbsp;&nbsp;&nbsp;&nbsp;{{location}}</div>
    <div class="icons"><span class="emotion_{{feeling}}"></span><span class="weather_{{weather}}"></span><span class="traffic_{{traffic}}"></span></div>
    <div class="images">
        {{#each images}}
        <a href="{{this}}" data-lightbox="roadtrip" title="{{location}}">
        <img vsrc="{{this}}" alt="{{location}}"/>
        </a>
        {{/each}}
    </div>
    <div class="description">
        {{words}}
    </div>
    </div>
</div>
{{/each}}
`;


export default { userInfo, indexInfo, detailInfo,timeLine};

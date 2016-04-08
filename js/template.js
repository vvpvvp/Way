
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

        // <p class="dark text-center font16">{{way.start.location}}&nbsp;To&nbsp;{{way.end.location}}</p>
// <div class="travelTitle">&nbsp; Current&nbsp;{{way.now.location}}&nbsp</div>

export default {userInfo,indexInfo};
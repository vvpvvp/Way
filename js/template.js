
let userInfo = 
``;

let indexInfo = 
`
{{#each content}}
<div class="travelContainer">
    <div class="startDate">
    <p>{{way.startDateShow.month}}月&nbsp;&nbsp;{{way.startDateShow.date}}</p>
    <p>{{way.startDateShow.year}}</p></div>

    <div class="travelTitle">{{way.start.location}}&nbsp;To&nbsp;{{way.end.location}}&nbsp; Current&nbsp;{{way.now.location}}&nbsp</div>
    <div class="mapContainer" id="mapContainer_{{@index}}">
    </div>
    <div class="userInfo">
        <div class="userIcon">
            <span style="background-image:url({{basic.avatar}})"></span>
        </div>
        <p class="userName">{{basic.name}}</p>
        <p class="dark text-center font16">{{basic.age}}岁&nbsp;{{basic.profession}}</p>
        <p class="wayTitle dark text-center">{{way.title}}</p>
        <a href="" class="greenButton">More</a>
    </div>
</div>
{{/each}}
`;


export default {userInfo,indexInfo};
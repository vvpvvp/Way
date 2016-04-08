
let userInfo = 
``;

let indexInfo = 
`
{{#each content}}
<div class="travelContainer">
    <span class="startDate"></span>
    <div class="travelTitle"></div>
    <div class="mapContainer">
    </div>
    <div class="userInfo">
        <div class="userIcon">
            <span style="background-image:url({{basic.avatar}})"></span>
        </div>
        <p class="userName">{{basic.name}}</p>
        <p>{{basic.age}}岁&nbsp;{{basic.profession}}</p>
        <a href="" class="greenButton">More</a>
    </div>
</div>
{{/each}}
`;


export default {userInfo,indexInfo};
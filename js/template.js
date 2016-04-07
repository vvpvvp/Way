export default {
	"userInfo":
	`<div>
		<div>{{a}}</div>
	</div>`,

	"userInfo2":
	`<div>
		<div>2</div>
	</div>`,

    'travelInfo': `
    <div id="wayList">
        {{#each datas}}
         <div class="way {{#if @first}}active{{/if}}" id="{{id}}">
            {{basic.name}}
            <ul class="pull-right">
                {{#each history}}
                    <li><a href="way.html#{{id}}">{{title}}{{#if @last}}ing.....{{/if}}</a></li>
                {{/each}}
            </ul>
         </div>
        {{/each}}
    </div>
    `
}
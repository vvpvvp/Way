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
         <div class="way {{#if @first}}active{{/if}}" id="{{id}}">{{@index}}{{basic.name}}</div>
        {{/each}}
    </div>
    `
}
(this["webpackJsonpmonday-integration-quickstart-app"]=this["webpackJsonpmonday-integration-quickstart-app"]||[]).push([[0],{17:function(t,e,a){t.exports=a(45)},22:function(t,e,a){},23:function(t,e,a){},45:function(t,e,a){"use strict";a.r(e);var n=a(0),s=a.n(n),o=a(10),i=a.n(o),r=(a(22),a(11)),c=a(12),d=a(16),l=a(15),u=(a(23),a(13)),m=a.n(u),h=(a(39),a(14)),b=a.n(h),p=m()(),g=function(t){Object(d.a)(a,t);var e=Object(l.a)(a);function a(t){var n;return Object(r.a)(this,a),(n=e.call(this,t)).state={settings:{},name:""},n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var t=this;p.listen("settings",(function(e){t.setState({settings:e.data}),console.log(e.data),p.api("query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:1) { name column_values { title text } } } }",{variables:{boardIds:t.state.context.boardIds}}).then((function(e){t.setState({boardData:e.data})}))})),p.listen("context",(function(e){t.setState({context:e.data}),console.log(e.data),p.api("query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:1) { name column_values { title text } } } }",{variables:{boardIds:t.state.context.boardIds}}).then((function(e){t.setState({boardData:e.data})}))}))}},{key:"render",value:function(){return s.a.createElement("div",{className:"App",style:{background:this.state.settings.background}},s.a.createElement(b.a,{title:this.state.settings.attentionBoxTitle||"Hello monday.apps",text:this.state.settings.attentionBoxMessage||"You should be able to edit the info that appears here using the fields you've set up previously in the View settings :) ",type:this.state.settings.attentionBoxType||"success"}),JSON.stringify(this.state.boardData,null,2))}}]),a}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(g,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[17,1,2]]]);
//# sourceMappingURL=main.13c150eb.chunk.js.map
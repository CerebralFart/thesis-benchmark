import{M as S,a as v,c as D}from "./current-dataset-navigation-guards-D6PAcll1.js";import{d as k}from "./index-C-z09IKS.js";import{P as z}from "./bootstrap.esm-B848_XlO.js";import{_ as L,bR as $,bO as w,r as p,a as o,b as t,t as c,d as b,F as m,e as _,bB as h,o as i}from "./index-9t_Zu7tB.js";const R={name:"DatasetInfo",components:{TableListing:$,JenaTable:w,Menu:S},...v,mixins:[D],data(){return{datasetStats:{},datasetSize:null,isDatasetSizeLoading:null,statsFields:[{key:"endpoint",label:"Endpoint"},{key:"total",label:"Requests",sortable:!0,sortDirection:"asc"},{key:"good",label:"Good",sortable:!0,sortDirection:"asc"},{key:"bad",label:"Bad",sortable:!0,sortDirection:"asc"}],countGraphFields:[{key:"name",label:"graph name",sortable:!0,sortDirection:"asc"},{key:"triples",label:"triples",sortable:!0,sortDirection:"asc"}]}},computed:{statsItems(){if(!this.datasetStats||!this.datasetStats.datasets)return[];const s=this.datasetStats.datasets[`/${this.datasetName}`],e=s.endpoints;if(!s||!e)return[];const d=Object.keys(e).map(a=>({endpoint:a.startsWith("_")?e[a].description:`${e[a].description} (${a})`,operation:e[a].operation,total:e[a].Requests,good:e[a].RequestsGood,bad:e[a].RequestsBad}));return d.sort((a, r)=>a.operation.localeCompare(r.operation)),d},overall(){if(!this.datasetStats||!this.datasetStats.datasets)return[];const s=this.datasetStats.datasets[`/${this.datasetName}`];return{endpoint:"Overall",total:s.Requests,good:s.RequestsGood,bad:s.RequestsBad}},countGraphItems(){return this.datasetSize?Object.keys(this.datasetSize).map(s=>({name:s,triples:this.datasetSize[s]})):[]}},async beforeRouteUpdate(s, e, d){this.datasetSize=null;const a=v.beforeRouteUpdate;await a(s,e,d)},mounted:function(){const s={html:!0,content:this.$refs["count-triples-content"]},e=this.$refs["count-triples-button"];new z(e,s)},methods:{async countTriplesInGraphs(){this.isDatasetSizeLoading=!0;try{this.datasetSize=await this.$fusekiService.getDatasetSize(this.currentDataset["ds.name"],this.services.query["srv.endpoints"][0]),this.$refs["count-triples-button"].disabled=this.isDatasetSizeLoading,this.datasetStats=await this.$fusekiService.getDatasetStats(this.datasetName)}catch(s){k(this,s)}finally{this.isDatasetSizeLoading=null,this.$refs["count-triples-button"].disabled=!1}}}},G={class:"container-fluid"},q={class:"row mt-4"},B={class:"col-12"},I={class:"card"},x={class:"card-header"},C={class:"card-body"},F={class:"row"},M={class:"col-sm-12 col-md-6"},O=t("h3",{class:"text-center"}," Available Services ",-1),T={key:0,class:"card-text placeholder-glow"},j=t("span",{class:"placeholder col-12"},null,-1),E=t("span",{class:"placeholder col-12"},null,-1),N=t("span",{class:"placeholder col-12"},null,-1),U=[j,E,N],P={class:"col-6 text-right"},V={class:"col-6"},A=["href"],J={class:"row my-4"},W={class:"col-12 text-center"},H=t("h3",null,"Dataset size",-1),K={class:"mb-2"},Q={hidden:""},X={ref:"count-triples-content"},Y={class:"text-center"},Z=t("div",{class:"alert alert-warning"}," This may be slow and impose a significant load on large datasets. ",-1),tt={ref:"count-triples-button",id:"count-triples-button",type:"button",class:"btn btn-primary","data-bs-toggle":"popover","data-bs-placement":"auto","data-bs-trigger":"focus",title:"Confirm"},st=t("div",{class:"text-center text-danger my-2"},[t("div",{class:"spinner-border align-middle",role:"status"},[t("span",{class:"visually-hidden"},"Loading...")]),t("strong",null,"Loading...")],-1),et=t("span",null,"No data",-1),at={class:"col-sm-12 col-md-6"},ot=t("h3",{class:"text-center"}," Statistics ",-1),it=t("div",{class:"text-center text-danger my-2"},[t("div",{class:"spinner-border align-middle",role:"status"},[t("span",{class:"visually-hidden"},"Loading...")]),t("strong",null,"Loading...")],-1);function nt(s, e, d, a, r, u){const f=p("Menu"),y=p("table-listing"),g=p("jena-table");return i(),o("div",G,[t("div",q,[t("div",B,[t("h2",null,"/"+c(s.datasetName),1),t("div",I,[t("nav",x,[b(f,{"dataset-name":s.datasetName},null,8,["dataset-name"])]),t("div",C,[t("div",null,[t("div",F,[t("div",M,[O,s.services==null?(i(),o("p",T,U)):(i(!0),o(m,{key:1},_(s.services, n=>(i(),o("div",{key:n["srv.type"]},[(i(!0),o(m,null,_(n["srv.endpoints"], l=>(i(),o("div",{class:"row",key:l},[t("div",P,c(n["srv.description"]),1),t("div",V,[t("a",{href:`/${s.datasetName}/${l}`}," /"+c(s.datasetName)+"/"+c(l),9,A)])]))),128))]))),128)),t("div",J,[t("div",W,[H,t("div",K,[t("div",Q,[t("div",X,[t("div",Y,[Z,t("button",{onClick:e[0]||(e[0]= n=>{u.countTriplesInGraphs(),s.$refs["count-triples-button"].disabled=s.isDatasetStatsLoading}),id:"count-triples-submit-button",type:"button",class:"btn btn-primary me-2"}," submit "),t("button",{class:"btn btn-secondary",onClick:e[1]||(e[1]= n=>s.$refs["count-triples-button"].disabled=s.isDatasetStatsLoading)}," cancel ")])],512)]),t("button",tt," count triples in all graphs ",512)]),b(y,{fields:r.countGraphFields,items:u.countGraphItems,busy:r.isDatasetSizeLoading,filterable:!1,id:"dataset-size-table",class:"mt-3",bordered:"",hover:"",small:""},{"table-busy":h(()=>[st]),empty:h(()=>[et]),_:1},8,["fields","items","busy"])])])]),t("div",at,[ot,b(g,{fields:r.statsFields,items:u.statsItems,busy:s.isDatasetStatsLoading,id:"statistics-table",bordered:"",hover:"",small:""},{"table-busy":h(()=>[it]),"custom-foot":h(n=>[t("tr",null,[(i(!0),o(m,null,_(n.fields, l=>(i(),o("th",{key:l.key},c(u.overall[l.key]),1))),128))])]),_:1},8,["fields","items","busy"])])])])])])])])])}const ut=L(R,[["render",nt]]);export{ut as default};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5mby1HeWF2d3pRby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ZpZXdzL2RhdGFzZXQvSW5mby52dWUiXSwic291cmNlc0NvbnRlbnQiOlsiPCEtLVxuICAgTGljZW5zZWQgdG8gdGhlIEFwYWNoZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIChBU0YpIHVuZGVyIG9uZSBvciBtb3JlXG4gICBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuICBTZWUgdGhlIE5PVElDRSBmaWxlIGRpc3RyaWJ1dGVkIHdpdGhcbiAgIHRoaXMgd29yayBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiByZWdhcmRpbmcgY29weXJpZ2h0IG93bmVyc2hpcC5cbiAgIFRoZSBBU0YgbGljZW5zZXMgdGhpcyBmaWxlIHRvIFlvdSB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wXG4gICAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gICB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiAgIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAgIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAgIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4tLT5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+XG4gICAgPGRpdiBjbGFzcz1cInJvdyBtdC00XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XG4gICAgICAgIDxoMj4ve3sgZGF0YXNldE5hbWUgfX08L2gyPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxuICAgICAgICAgIDxuYXYgY2xhc3M9XCJjYXJkLWhlYWRlclwiPlxuICAgICAgICAgICAgPE1lbnUgOmRhdGFzZXQtbmFtZT1cImRhdGFzZXROYW1lXCIgLz5cbiAgICAgICAgICA8L25hdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBjb2wtbWQtNlwiPlxuICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwidGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgQXZhaWxhYmxlIFNlcnZpY2VzXG4gICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjYXJkLXRleHQgcGxhY2Vob2xkZXItZ2xvd1wiIHYtaWY9XCJzZXJ2aWNlcyA9PSBudWxsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGxhY2Vob2xkZXIgY29sLTEyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBsYWNlaG9sZGVyIGNvbC0xMlwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwbGFjZWhvbGRlciBjb2wtMTJcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIDprZXk9XCJzZXJ2aWNlWydzcnYudHlwZSddXCJcbiAgICAgICAgICAgICAgICAgICAgdi1mb3I9XCJzZXJ2aWNlIGluIHNlcnZpY2VzXCJcbiAgICAgICAgICAgICAgICAgICAgdi1lbHNlXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiB2LWZvcj1cImVuZHBvaW50IG9mIHNlcnZpY2VbJ3Nydi5lbmRwb2ludHMnXVwiIDprZXk9XCJlbmRwb2ludFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtNiB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7eyBzZXJ2aWNlWydzcnYuZGVzY3JpcHRpb24nXSB9fVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgOmhyZWY9XCJgLyR7ZGF0YXNldE5hbWV9LyR7ZW5kcG9pbnR9YFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAve3sgZGF0YXNldE5hbWUgfX0ve3sgZW5kcG9pbnQgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXktNFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGgzPkRhdGFzZXQgc2l6ZTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaGlkZGVuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj1cImNvdW50LXRyaXBsZXMtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LXdhcm5pbmdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhpcyBtYXkgYmUgc2xvdyBhbmQgaW1wb3NlIGEgc2lnbmlmaWNhbnQgbG9hZCBvbiBsYXJnZSBkYXRhc2V0cy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAY2xpY2s9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudFRyaXBsZXNJbkdyYXBocygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyZWZzWydjb3VudC10cmlwbGVzLWJ1dHRvbiddLmRpc2FibGVkID0gaXNEYXRhc2V0U3RhdHNMb2FkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiY291bnQtdHJpcGxlcy1zdWJtaXQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IG1lLTJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJtaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQGNsaWNrPVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJlZnNbJ2NvdW50LXRyaXBsZXMtYnV0dG9uJ10uZGlzYWJsZWQgPSBpc0RhdGFzZXRTdGF0c0xvYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmPVwiY291bnQtdHJpcGxlcy1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cImNvdW50LXRyaXBsZXMtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1icy10b2dnbGU9XCJwb3BvdmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1icy1wbGFjZW1lbnQ9XCJhdXRvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1icy10cmlnZ2VyPVwiZm9jdXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkNvbmZpcm1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCB0cmlwbGVzIGluIGFsbCBncmFwaHNcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZS1saXN0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICA6ZmllbGRzPVwiY291bnRHcmFwaEZpZWxkc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICA6aXRlbXM9XCJjb3VudEdyYXBoSXRlbXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgOmJ1c3k9XCJpc0RhdGFzZXRTaXplTG9hZGluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICA6ZmlsdGVyYWJsZT1cImZhbHNlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZGF0YXNldC1zaXplLXRhYmxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibXQtM1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgaG92ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNtYWxsXG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRlbXBsYXRlICN0YWJsZS1idXN5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgdGV4dC1kYW5nZXIgbXktMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGlubmVyLWJvcmRlciBhbGlnbi1taWRkbGVcIiByb2xlPVwic3RhdHVzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiPkxvYWRpbmcuLi48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz5Mb2FkaW5nLi4uPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSAjZW1wdHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPk5vIGRhdGE8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGUtbGlzdGluZz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIGNvbC1tZC02XCI+XG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICBTdGF0aXN0aWNzXG4gICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgPGplbmEtdGFibGVcbiAgICAgICAgICAgICAgICAgICAgOmZpZWxkcz1cInN0YXRzRmllbGRzXCJcbiAgICAgICAgICAgICAgICAgICAgOml0ZW1zPVwic3RhdHNJdGVtc1wiXG4gICAgICAgICAgICAgICAgICAgIDpidXN5PVwiaXNEYXRhc2V0U3RhdHNMb2FkaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJzdGF0aXN0aWNzLXRhYmxlXCJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyZWRcbiAgICAgICAgICAgICAgICAgICAgaG92ZXJcbiAgICAgICAgICAgICAgICAgICAgc21hbGxcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHRlbXBsYXRlICN0YWJsZS1idXN5PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlciB0ZXh0LWRhbmdlciBteS0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3Bpbm5lci1ib3JkZXIgYWxpZ24tbWlkZGxlXCIgcm9sZT1cInN0YXR1c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiPkxvYWRpbmcuLi48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+TG9hZGluZy4uLjwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgI2N1c3RvbS1mb290PVwic2NvcGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggdi1mb3I9XCJmaWVsZCBpbiBzY29wZS5maWVsZHNcIiA6a2V5PVwiZmllbGQua2V5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt7IG92ZXJhbGxbZmllbGQua2V5XSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgPC9qZW5hLXRhYmxlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG5pbXBvcnQgTWVudSBmcm9tICdAL2NvbXBvbmVudHMvZGF0YXNldC9NZW51LnZ1ZSdcbmltcG9ydCB7IGRpc3BsYXlFcnJvciB9IGZyb20gJ0AvdXRpbHMnXG5pbXBvcnQgY3VycmVudERhdGFzZXRNaXhpbiBmcm9tICdAL21peGlucy9jdXJyZW50LWRhdGFzZXQnXG5pbXBvcnQgY3VycmVudERhdGFzZXRNaXhpbk5hdmlnYXRpb25HdWFyZHMgZnJvbSAnQC9taXhpbnMvY3VycmVudC1kYXRhc2V0LW5hdmlnYXRpb24tZ3VhcmRzJ1xuaW1wb3J0IHsgUG9wb3ZlciB9IGZyb20gJ2Jvb3RzdHJhcCdcbmltcG9ydCBKZW5hVGFibGUgZnJvbSAnQC9jb21wb25lbnRzL2RhdGFzZXQvSmVuYVRhYmxlLnZ1ZSdcbmltcG9ydCBUYWJsZUxpc3RpbmcgZnJvbSBcIkAvY29tcG9uZW50cy9kYXRhc2V0L1RhYmxlTGlzdGluZy52dWVcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnRGF0YXNldEluZm8nLFxuXG4gIGNvbXBvbmVudHM6IHtcbiAgICBUYWJsZUxpc3RpbmcsXG4gICAgSmVuYVRhYmxlLFxuICAgIE1lbnVcbiAgfSxcblxuICAuLi5jdXJyZW50RGF0YXNldE1peGluTmF2aWdhdGlvbkd1YXJkcyxcblxuICBtaXhpbnM6IFtcbiAgICBjdXJyZW50RGF0YXNldE1peGluXG4gIF0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGFzZXRTdGF0czoge30sXG4gICAgICBkYXRhc2V0U2l6ZTogbnVsbCxcbiAgICAgIGlzRGF0YXNldFNpemVMb2FkaW5nOiBudWxsLFxuICAgICAgc3RhdHNGaWVsZHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogJ2VuZHBvaW50JyxcbiAgICAgICAgICBsYWJlbDogJ0VuZHBvaW50J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiAndG90YWwnLFxuICAgICAgICAgIGxhYmVsOiAnUmVxdWVzdHMnLFxuICAgICAgICAgIHNvcnRhYmxlOiB0cnVlLFxuICAgICAgICAgIHNvcnREaXJlY3Rpb246ICdhc2MnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdnb29kJyxcbiAgICAgICAgICBsYWJlbDogJ0dvb2QnLFxuICAgICAgICAgIHNvcnRhYmxlOiB0cnVlLFxuICAgICAgICAgIHNvcnREaXJlY3Rpb246ICdhc2MnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6ICdiYWQnLFxuICAgICAgICAgIGxhYmVsOiAnQmFkJyxcbiAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBzb3J0RGlyZWN0aW9uOiAnYXNjJ1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgY291bnRHcmFwaEZpZWxkczogW1xuICAgICAgICB7XG4gICAgICAgICAga2V5OiAnbmFtZScsXG4gICAgICAgICAgbGFiZWw6ICdncmFwaCBuYW1lJyxcbiAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBzb3J0RGlyZWN0aW9uOiAnYXNjJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiAndHJpcGxlcycsXG4gICAgICAgICAgbGFiZWw6ICd0cmlwbGVzJyxcbiAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBzb3J0RGlyZWN0aW9uOiAnYXNjJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgc3RhdHNJdGVtcyAoKSB7XG4gICAgICBpZiAoIXRoaXMuZGF0YXNldFN0YXRzIHx8ICF0aGlzLmRhdGFzZXRTdGF0cy5kYXRhc2V0cykge1xuICAgICAgICByZXR1cm4gW11cbiAgICAgIH1cbiAgICAgIGNvbnN0IGRhdGFzZXQgPSB0aGlzLmRhdGFzZXRTdGF0cy5kYXRhc2V0c1tgLyR7dGhpcy5kYXRhc2V0TmFtZX1gXVxuICAgICAgY29uc3QgZW5kcG9pbnRzID0gZGF0YXNldC5lbmRwb2ludHNcbiAgICAgIGlmICghZGF0YXNldCB8fCAhZW5kcG9pbnRzKSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgICAgfVxuICAgICAgLy8gY29sbGVjdCB0aGUgc3RhdHMgb2YgZWFjaCBlbmRwb2ludFxuICAgICAgY29uc3QgaXRlbXMgPSBPYmplY3Qua2V5cyhlbmRwb2ludHMpXG4gICAgICAgIC5tYXAoZW5kcG9pbnROYW1lID0+IHtcbiAgICAgICAgICBjb25zdCBlbmRwb2ludCA9ICFlbmRwb2ludE5hbWUuc3RhcnRzV2l0aCgnXycpID8gYCR7ZW5kcG9pbnRzW2VuZHBvaW50TmFtZV0uZGVzY3JpcHRpb259ICgke2VuZHBvaW50TmFtZX0pYCA6IGVuZHBvaW50c1tlbmRwb2ludE5hbWVdLmRlc2NyaXB0aW9uXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVuZHBvaW50OiBlbmRwb2ludCxcbiAgICAgICAgICAgIG9wZXJhdGlvbjogZW5kcG9pbnRzW2VuZHBvaW50TmFtZV0ub3BlcmF0aW9uLFxuICAgICAgICAgICAgdG90YWw6IGVuZHBvaW50c1tlbmRwb2ludE5hbWVdLlJlcXVlc3RzLFxuICAgICAgICAgICAgZ29vZDogZW5kcG9pbnRzW2VuZHBvaW50TmFtZV0uUmVxdWVzdHNHb29kLFxuICAgICAgICAgICAgYmFkOiBlbmRwb2ludHNbZW5kcG9pbnROYW1lXS5SZXF1ZXN0c0JhZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIGl0ZW1zLnNvcnQoKGxlZnQsIHJpZ2h0KSA9PiB7XG4gICAgICAgIHJldHVybiBsZWZ0Lm9wZXJhdGlvbi5sb2NhbGVDb21wYXJlKHJpZ2h0Lm9wZXJhdGlvbilcbiAgICAgIH0pXG4gICAgICByZXR1cm4gaXRlbXNcbiAgICB9LFxuICAgIG92ZXJhbGwgKCkge1xuICAgICAgaWYgKCF0aGlzLmRhdGFzZXRTdGF0cyB8fCAhdGhpcy5kYXRhc2V0U3RhdHMuZGF0YXNldHMpIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgICB9XG4gICAgICBjb25zdCBkYXRhc2V0ID0gdGhpcy5kYXRhc2V0U3RhdHMuZGF0YXNldHNbYC8ke3RoaXMuZGF0YXNldE5hbWV9YF1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVuZHBvaW50OiAnT3ZlcmFsbCcsXG4gICAgICAgIHRvdGFsOiBkYXRhc2V0LlJlcXVlc3RzLFxuICAgICAgICBnb29kOiBkYXRhc2V0LlJlcXVlc3RzR29vZCxcbiAgICAgICAgYmFkOiBkYXRhc2V0LlJlcXVlc3RzQmFkXG4gICAgICB9XG4gICAgfSxcbiAgICBjb3VudEdyYXBoSXRlbXMgKCkge1xuICAgICAgaWYgKCF0aGlzLmRhdGFzZXRTaXplKSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuZGF0YXNldFNpemUpXG4gICAgICAgIC5tYXAoa2V5ID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgICAgdHJpcGxlczogdGhpcy5kYXRhc2V0U2l6ZVtrZXldXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBhc3luYyBiZWZvcmVSb3V0ZVVwZGF0ZSAoZnJvbSwgdG8sIG5leHQpIHtcbiAgICB0aGlzLmRhdGFzZXRTaXplID0gbnVsbFxuICAgIGNvbnN0IG1peGluQmVmb3JlUm91dGVVcGRhdGUgPSBjdXJyZW50RGF0YXNldE1peGluTmF2aWdhdGlvbkd1YXJkcy5iZWZvcmVSb3V0ZVVwZGF0ZVxuICAgIGF3YWl0IG1peGluQmVmb3JlUm91dGVVcGRhdGUoZnJvbSwgdG8sIG5leHQpXG4gIH0sXG5cbiAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIEluaXRpYWxpemUgdGhlIEJvb3RzdHJhcCBQb3BvdmVyXG4gICAgY29uc3QgcG9wb3Zlck9wdGlvbnMgPSB7XG4gICAgICBodG1sOiB0cnVlLFxuICAgICAgY29udGVudDogdGhpcy4kcmVmc1snY291bnQtdHJpcGxlcy1jb250ZW50J11cbiAgICB9XG4gICAgY29uc3QgcG9wb3ZlckVsZW1lbnQgPSB0aGlzLiRyZWZzWydjb3VudC10cmlwbGVzLWJ1dHRvbiddXG4gICAgLy8gVEJEOiB3aWxsIGl0IGJlIGdhcmJhZ2UgY29sbGVjdGVkP1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXdcbiAgICBuZXcgUG9wb3Zlcihwb3BvdmVyRWxlbWVudCwgcG9wb3Zlck9wdGlvbnMpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGFzeW5jIGNvdW50VHJpcGxlc0luR3JhcGhzICgpIHtcbiAgICAgIHRoaXMuaXNEYXRhc2V0U2l6ZUxvYWRpbmcgPSB0cnVlXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmRhdGFzZXRTaXplID0gYXdhaXQgdGhpcy4kZnVzZWtpU2VydmljZS5nZXREYXRhc2V0U2l6ZSh0aGlzLmN1cnJlbnREYXRhc2V0Wydkcy5uYW1lJ10sIHRoaXMuc2VydmljZXMucXVlcnlbJ3Nydi5lbmRwb2ludHMnXVswXSlcbiAgICAgICAgdGhpcy4kcmVmc1snY291bnQtdHJpcGxlcy1idXR0b24nXS5kaXNhYmxlZCA9IHRoaXMuaXNEYXRhc2V0U2l6ZUxvYWRpbmdcbiAgICAgICAgdGhpcy5kYXRhc2V0U3RhdHMgPSBhd2FpdCB0aGlzLiRmdXNla2lTZXJ2aWNlLmdldERhdGFzZXRTdGF0cyh0aGlzLmRhdGFzZXROYW1lKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZGlzcGxheUVycm9yKHRoaXMsIGVycm9yKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5pc0RhdGFzZXRTaXplTG9hZGluZyA9IG51bGxcbiAgICAgICAgdGhpcy4kcmVmc1snY291bnQtdHJpcGxlcy1idXR0b24nXS5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cbiJdLCJuYW1lcyI6WyJfc2ZjX21haW4iLCJUYWJsZUxpc3RpbmciLCJKZW5hVGFibGUiLCJNZW51IiwiY3VycmVudERhdGFzZXRNaXhpbk5hdmlnYXRpb25HdWFyZHMiLCJjdXJyZW50RGF0YXNldE1peGluIiwiZGF0YXNldCIsImVuZHBvaW50cyIsIml0ZW1zIiwiZW5kcG9pbnROYW1lIiwibGVmdCIsInJpZ2h0Iiwia2V5IiwiZnJvbSIsInRvIiwibmV4dCIsIm1peGluQmVmb3JlUm91dGVVcGRhdGUiLCJwb3BvdmVyT3B0aW9ucyIsInBvcG92ZXJFbGVtZW50IiwiUG9wb3ZlciIsImVycm9yIiwiZGlzcGxheUVycm9yIiwiX2hvaXN0ZWRfMSIsIl9ob2lzdGVkXzIiLCJfaG9pc3RlZF8zIiwiX2hvaXN0ZWRfNCIsIl9ob2lzdGVkXzUiLCJfaG9pc3RlZF82IiwiX2hvaXN0ZWRfNyIsIl9ob2lzdGVkXzgiLCJfaG9pc3RlZF85IiwiX2NyZWF0ZUVsZW1lbnRWTm9kZSIsIl9ob2lzdGVkXzExIiwiX2hvaXN0ZWRfMTIiLCJfaG9pc3RlZF8xMyIsIl9ob2lzdGVkXzE1IiwiX2hvaXN0ZWRfMTYiLCJfaG9pc3RlZF8xNyIsIl9ob2lzdGVkXzE4IiwiX2hvaXN0ZWRfMTkiLCJfaG9pc3RlZF8yMCIsIl9ob2lzdGVkXzIxIiwiX2hvaXN0ZWRfMjIiLCJfaG9pc3RlZF8yMyIsIl9ob2lzdGVkXzI0IiwiX2hvaXN0ZWRfMjUiLCJfaG9pc3RlZF8yOCIsIl9ob2lzdGVkXzI5IiwiX2hvaXN0ZWRfMzAiLCJfb3BlbkJsb2NrIiwiX2NyZWF0ZUVsZW1lbnRCbG9jayIsIl90b0Rpc3BsYXlTdHJpbmciLCJfY3R4IiwiX2NyZWF0ZVZOb2RlIiwiX2NvbXBvbmVudF9NZW51IiwiX2hvaXN0ZWRfMTAiLCJfaG9pc3RlZF8xNCIsIl9GcmFnbWVudCIsIl9yZW5kZXJMaXN0Iiwic2VydmljZSIsImVuZHBvaW50IiwiX2NhY2hlIiwiJGV2ZW50IiwiJG9wdGlvbnMiLCJfaG9pc3RlZF8yNiIsIl9jb21wb25lbnRfdGFibGVfbGlzdGluZyIsIiRkYXRhIiwiX2hvaXN0ZWRfMjciLCJfY29tcG9uZW50X2plbmFfdGFibGUiLCJfaG9pc3RlZF8zMSIsIl93aXRoQ3R4Iiwic2NvcGUiLCJmaWVsZCJdLCJtYXBwaW5ncyI6ImtTQTZLQSxNQUFLQSxFQUFVLENBQ2IsS0FBTSxjQUVOLFdBQVksQ0FDVixhQUFBQyxFQUNBLFVBQUFDLEVBQ0EsS0FBQUMsQ0FDRCxFQUVELEdBQUdDLEVBRUgsT0FBUSxDQUNOQyxDQUNELEVBRUQsTUFBUSxDQUNOLE1BQU8sQ0FDTCxhQUFjLENBQUUsRUFDaEIsWUFBYSxLQUNiLHFCQUFzQixLQUN0QixZQUFhLENBQ1gsQ0FDRSxJQUFLLFdBQ0wsTUFBTyxVQUNSLEVBQ0QsQ0FDRSxJQUFLLFFBQ0wsTUFBTyxXQUNQLFNBQVUsR0FDVixjQUFlLEtBQ2hCLEVBQ0QsQ0FDRSxJQUFLLE9BQ0wsTUFBTyxPQUNQLFNBQVUsR0FDVixjQUFlLEtBQ2hCLEVBQ0QsQ0FDRSxJQUFLLE1BQ0wsTUFBTyxNQUNQLFNBQVUsR0FDVixjQUFlLEtBQ2pCLENBQ0QsRUFDRCxpQkFBa0IsQ0FDaEIsQ0FDRSxJQUFLLE9BQ0wsTUFBTyxhQUNQLFNBQVUsR0FDVixjQUFlLEtBQ2hCLEVBQ0QsQ0FDRSxJQUFLLFVBQ0wsTUFBTyxVQUNQLFNBQVUsR0FDVixjQUFlLEtBQ2pCLENBQ0YsQ0FDRixDQUNELEVBRUQsU0FBVSxDQUNSLFlBQWMsQ0FDWixHQUFJLENBQUMsS0FBSyxjQUFnQixDQUFDLEtBQUssYUFBYSxTQUMzQyxNQUFPLENBQUMsRUFFVixNQUFNQyxFQUFVLEtBQUssYUFBYSxTQUFTLElBQUksS0FBSyxXQUFXLEVBQUUsRUFDM0RDLEVBQVlELEVBQVEsVUFDMUIsR0FBSSxDQUFDQSxHQUFXLENBQUNDLEVBQ2YsTUFBTyxDQUFDLEVBR1YsTUFBTUMsRUFBUSxPQUFPLEtBQUtELENBQVMsRUFDaEMsSUFBSUUsSUFFSSxDQUNMLFNBRmdCQSxFQUFhLFdBQVcsR0FBRyxFQUFpRUYsRUFBVUUsQ0FBWSxF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
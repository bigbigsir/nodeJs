(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["menu","chunk-0a68809a","chunk-2d22a183"],{"0700":function(t,e,n){},"27ae":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-table-column",t._b({attrs:{prop:t.prop},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",{class:e.row[t.childKey].length?"parent-node":"child-node",style:{"padding-left":13*(e.row._level||0)+"px"},on:{click:function(n){return n.preventDefault(),t.toggleHandle(e.$index,e.row)}}},[n("i",{class:e.row._expanded?"el-icon-caret-bottom":"el-icon-caret-right"}),t._v(" "+t._s(e.row[t.prop])+" ")])]}}])},"el-table-column",t.$attrs,!1))},i=[],r=(n("99af"),n("4160"),n("c975"),n("a434"),n("159b"),n("2909")),o={name:"TableTreeColumn",props:{menuData:{type:Array,default:function(){return[]}},prop:{type:String},treeKey:{type:String,default:"id"},parentKey:{type:String,default:"parentId"},childKey:{type:String,default:"children"}},methods:{hasChild:function(t){return Array.isArray(t[this.childKey])&&t[this.childKey].length},toggleHandle:function(t,e){if(!this.hasChild(e))return!1;var n=Object(r["a"])(this.menuData);n[t]._expanded=!n[t]._expanded,n[t]._expanded?(e[this.childKey].forEach((function(t){t._level=(e._level||0)+1,t._expanded=!1})),n=n.splice(0,t+1).concat(e[this.childKey]).concat(n)):n=this.removeChildNode(n,e[this.treeKey]),this.$emit("updateMenuData",n)},removeChildNode:function(t,e){var n=[];if(e=Array.isArray(e)?e:[e],!e.length)return t;for(var a=t.length;a--;)~e.indexOf(t[a][this.parentKey])&&!~e.indexOf(t[a][this.treeKey])&&n.push(t.splice(a,1)[0][this.treeKey]);return this.removeChildNode(t,n)}}},s=o,l=(n("5136"),n("2877")),u=Object(l["a"])(s,a,i,!1,null,"3feb1b48",null);e["default"]=u.exports},"29f5":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-card",{staticClass:"box-card",attrs:{shadow:"never"}},[n("div",{attrs:{slot:"header"},slot:"header"},[n("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.addOrUpdateHandle(null)}}},[n("svg-icon",{attrs:{icon:"plus"}}),t._v(" "+t._s(t.$t("add"))+" ")],1)],1),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.getDataLoading,expression:"getDataLoading"}],attrs:{data:t.menuData,border:""}},[n("table-tree-column",{attrs:{label:t.$t("menu.name"),prop:"label",menuData:t.menuData,childKey:t.childKey,"min-width":"150px"},on:{updateMenuData:t.updateMenuData}}),n("el-table-column",{attrs:{label:t.$t("menu.icon"),prop:"icon",align:"center"},scopedSlots:t._u([{key:"default",fn:function(t){return[n("svg-icon",{attrs:{icon:t.row.icon}})]}}])}),n("el-table-column",{attrs:{label:t.$t("menu.routePath"),prop:"routerPath",align:"center"}}),n("el-table-column",{attrs:{label:t.$t("menu.resourceUrl"),prop:"resourceUrl","min-width":"150px",align:"center"}}),n("el-table-column",{attrs:{label:t.$t("menu.openMode"),prop:"openMode",align:"center",width:"150"}}),n("el-table-column",{attrs:{label:t.$t("menu.sort"),prop:"sort",align:"center",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-input-number",{attrs:{min:1,max:100,size:"small"},on:{change:function(n){return t.updateSort("id",e.row.id,"sort",e.row.sort)}},model:{value:e.row.sort,callback:function(n){t.$set(e.row,"sort",n)},expression:"scope.row.sort"}})]}}])}),n("el-table-column",{attrs:{label:t.$t("handle"),fixed:"right",align:"center",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{staticClass:"pd0",attrs:{type:"text"},on:{click:function(n){return t.addOrUpdateHandle(e.row.id)}}},[t._v(t._s(t.$t("update")))]),n("el-button",{staticClass:"pd0",attrs:{type:"text"},on:{click:function(n){return t.deleteMenu(e.row)}}},[t._v(t._s(t.$t("delete")))])]}}])})],1),t.isRenderDialog?n("addOrUpdate",{ref:"addOrUpdate",attrs:{menuData:t.copyMenuData},on:{refreshList:t.getListData}}):t._e()],1)},i=[],r=(n("4160"),n("159b"),n("1106")),o=n("dff1"),s=n("27ae"),l={name:"sys_menu",mixins:[o["default"]],components:{TableTreeColumn:s["default"],addOrUpdate:r["default"]},data:function(){return{childKey:"child",menuData:[],copyMenuData:[],mixinConfig:{getListDataURL:"/api/menu/tree",deleteURL:"/api/menu/remove",updateSortURL:"/api/menu/updateOne"}}},created:function(){console.log("sys_menu")},methods:{getListDataAfter:function(t){function e(t){var n=this;t.forEach((function(t){t[n.childKey]=t.children,delete t.children,t[n.childKey].length&&e.call(n,t[n.childKey])}))}this.copyMenuData=JSON.parse(JSON.stringify(t)),e.call(this,t),this.menuData=t},updateMenuData:function(t){this.menuData=t},deleteMenu:function(t){var e=this.recursionPushId(t);this.deleteHandle(e)},recursionPushId:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return n.push(t.id),t.children&&t.children.length&&t.children.forEach((function(t){return e.recursionPushId(t,n)})),n}}},u=l,c=n("2877"),d=Object(c["a"])(u,a,i,!1,null,null,null);e["default"]=d.exports},5136:function(t,e,n){"use strict";var a=n("0700"),i=n.n(a);i.a},a434:function(t,e,n){"use strict";var a=n("23e7"),i=n("23cb"),r=n("a691"),o=n("50c4"),s=n("7b0b"),l=n("65f0"),u=n("8418"),c=n("1dde"),d=n("ae40"),h=c("splice"),f=d("splice",{ACCESSORS:!0,0:0,1:2}),p=Math.max,g=Math.min,m=9007199254740991,v="Maximum allowed length exceeded";a({target:"Array",proto:!0,forced:!h||!f},{splice:function(t,e){var n,a,c,d,h,f,D=s(this),y=o(D.length),b=i(t,y),x=arguments.length;if(0===x?n=a=0:1===x?(n=0,a=y-b):(n=x-2,a=g(p(r(e),0),y-b)),y+n-a>m)throw TypeError(v);for(c=l(D,a),d=0;d<a;d++)h=b+d,h in D&&u(c,d,D[h]);if(c.length=a,n<a){for(d=b;d<y-a;d++)h=d+a,f=d+n,h in D?D[f]=D[h]:delete D[f];for(d=y;d>y-a+n;d--)delete D[d-1]}else if(n>a)for(d=y-a;d>b;d--)h=d+a-1,f=d+n-1,h in D?D[f]=D[h]:delete D[f];for(d=0;d<n;d++)D[d+b]=arguments[d+2];return D.length=y-a+n,c}})},dff1:function(t,e,n){"use strict";n.r(e);n("d81d"),n("d3b7");var a=n("ade3"),i=n("5530");function r(){var t=this;this.$message({message:this.$t("prompt.success"),type:"success",duration:1e3,showClose:!0,onClose:function(){t.getListData()}})}var o={data:function(){return{mixinConfig:{activatedAutoRequest:!0,getListDataURL:null,getListDataIsPage:!1,deleteURL:null,isBatchDelete:!1,batchDeleteKey:"id",getDetailsURL:null,updateStatusURL:null,updateSortURL:null,exportURL:null},listData:[],queryParams:{},page:1,pageSize:10,total:0,order:null,orderField:null,getDataLoading:!1,isRenderDialog:!1,listSelections:[]}},created:function(){this.mixinConfig.activatedAutoRequest&&this.getListData()},methods:{getListData:function(){var t=this,e=this.mixinConfig.getListDataURL,n=Object(i["a"])({order:this.order,orderField:this.orderField,page:this.mixinConfig.getListDataIsPage?this.page:null,pageSize:this.mixinConfig.getListDataIsPage?this.pageSize:null},this.queryParams);if(e){for(var a in this.getDataLoading=!0,n)n[a]||delete n[a];return this.$http.get(e,n).then((function(e){var n=e.ok,a=e.data,i=e.msg;return t.getDataLoading=!1,n?(t.listData=t.mixinConfig.getListDataIsPage&&a.rows?a.rows:a,t.total=t.mixinConfig.getListDataIsPage?a.total:0,t.getListDataAfter(t.listData),a):(t.$message.error(i),Promise.reject(i))})).catch((function(){t.getDataLoading=!1}))}},selectionChangeHandle:function(t){this.listSelections=t},handlePageSizeChange:function(t){this.page=this.total/t>=this.page?this.page:0,this.pageSize=t,this.getListData()},handleCurrentPageChange:function(t){this.page=t,this.getListData()},addOrUpdateHandle:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.isRenderDialog=!0,this.$nextTick((function(){t.$refs.addOrUpdate.visible=!0,t.$refs.addOrUpdate.formData.id=e}))},deleteHandle:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"id",i=this.$t("prompt.title"),o=this.$t("prompt.info",{handle:this.$t("delete")}),s={confirmButtonText:this.$t("confirm"),cancelButtonText:this.$t("cancel"),type:"warning"},l=this.mixinConfig.deleteURL;if(l)return e||!this.mixinConfig.isBatchDelete||this.listSelections.length?(e=!e&&this.mixinConfig.isBatchDelete?this.listSelections.map((function(e){return e[t.mixinConfig.batchDeleteKey]})):e,this.$confirm(o,i,s).then((function(){return t.$http.delete(l,Object(a["a"])({},n,e)).then((function(e){var n=e.ok,a=e.msg,i=void 0===a?"error":a;return n?(r.call(t),!0):(t.$message.error(i),Promise.reject(i))}))})).catch((function(){return!1}))):this.$message({message:this.$t("prompt.deleteSelect"),type:"warning",duration:1e3})},updateStatus:function(t,e,n,i){var o,s=this,l=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"put",u=this.$t("prompt.title"),c=this.$t("prompt.info",{handle:this.$t("update")}),d={confirmButtonText:this.$t("confirm"),cancelButtonText:this.$t("cancel"),type:"warning"},h=this.mixinConfig.updateStatusURL,f=(o={},Object(a["a"])(o,t,e),Object(a["a"])(o,n,i),o);if(h)return this.$confirm(c,u,d).then((function(){return s.$http[l](h,f).then((function(t){var e=t.ok,n=t.msg,a=void 0===n?"error":n;return e?(r.call(s),!0):(s.$message.error(a),Promise.reject(a))}))})).catch((function(){return s.getListData(),!1}))},updateSort:function(t,e,n,i){var o,s=this,l=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"put",u=this.mixinConfig.updateSortURL,c=(o={},Object(a["a"])(o,t,e),Object(a["a"])(o,n,i),o);if(u)return this.$http[l](u,c).then((function(t){var e=t.ok,n=t.msg,a=void 0===n?"error":n;return e?(r.call(s),!0):(s.$message.error(a),Promise.reject(a))})).catch((function(){return s.getListData(),!1}))},sortChangeHandle:function(t){"asc"===this.order&&"desc"===this.order&&this.orderField&&this.getListData()},getListDataAfter:function(){return null}}};e["default"]=o}}]);
//# sourceMappingURL=menu.06c92694.js.map
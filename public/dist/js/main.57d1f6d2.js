(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["main","chunk-6f2b4607","chunk-2d22613e","chunk-2d0ab82f"],{"161e":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.menu.children&&e.menu.children.length?n("el-submenu",{attrs:{index:e.menu.id,"popper-append-to-body":!1}},[n("template",{slot:"title"},[n("svg-icon",{attrs:{icon:e.menu.icon||"tag"}}),n("span",[e._v(e._s(e.menu.label))])],1),e._l(e.menu.children,function(e){return n("sub-menu",{key:e.id,attrs:{menu:e}})})],2):n("el-menu-item",{attrs:{index:e.menu.id}},[n("svg-icon",{attrs:{icon:e.menu.icon||"tag"}}),n("span",{attrs:{slot:"title"},slot:"title"},[e._v(e._s(e.menu.label))])],1)},s=[],i={name:"subMenu",props:{menu:{type:Object,required:!0}}},r=i,o=n("2877"),l=Object(o["a"])(r,a,s,!1,null,null,null);t["default"]=l.exports},"85d4":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:e.loading,expression:"loading",modifiers:{fullscreen:!0,lock:!0}}],staticClass:"main-container reset-element-ui clearfix",class:{collapse:e.isCollapse,opacity0:e.loading},attrs:{id:"main","element-loading-text":e.$t("loading")}},[n("MainHeader"),n("MainSideMenu"),n("MainContent")],1)},s=[],i=(n("7f7f"),n("7514"),n("cebc")),r=(n("a481"),n("a78e")),o=n.n(r),l=n("a80c"),c=n("e6b9"),u=n("e35b"),m=n("b047"),d=n.n(m),b=n("2f62"),f={name:"mainPage",components:{MainHeader:l["default"],MainContent:c["default"],MainSideMenu:u["default"]},watch:{$route:"routeHandle"},beforeRouteEnter:function(e,t,n){n(function(t){t.routeHandle(e)})},beforeRouteLeave:function(e,t,n){this.setMenuActiveIndex(null),n()},data:function(){return{loading:!0}},created:function(){var e=this;this.windowResizeHandle(),this.getUserInfo().then(function(){e.loading=!1}).catch(function(){o.a.remove("token"),e.$router.replace("/login")})},computed:Object(i["a"])({},Object(b["d"])("main",["tabs","isCollapse"])),methods:Object(i["a"])({},Object(b["b"])(["getUserInfo"]),Object(b["c"])("main",["addTab","toggleCollapse","setMenuActiveIndex","setTabsActiveName"]),{windowResizeHandle:function(){var e=this;this.toggleCollapse(document.body.clientWidth<1e3),window.addEventListener("resize",d()(function(){e.toggleCollapse(document.body.clientWidth<1e3)},200))},routeHandle:function(e){if(this.setMenuActiveIndex(e.meta.id),"tab"!==e.meta.openMode)return!1;var t=this.tabs.find(function(t){return t.name===e.name});t||(t=Object(i["a"])({},e.meta,{path:e.path,name:e.name,params:Object(i["a"])({},e.params),query:Object(i["a"])({},e.query)}),this.addTab(t)),this.setTabsActiveName(e.name)}})},h=f,p=n("2877"),v=Object(p["a"])(h,a,s,!1,null,null,null);t["default"]=v.exports},e35b:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("aside",{staticClass:"main-side-menu fl",class:{dark:e.sideMenuDarkSkin}},[n("el-scrollbar",[n("el-menu",{ref:"menu",staticClass:"side-menu-root",attrs:{collapse:e.isCollapse,"collapse-transition":!1,"default-active":e.menuActiveIndex},on:{select:e.selectMenuHandle}},e._l(e.menuData,function(e){return n("SubMenu",{key:e.id,ref:"el_menu",refInFor:!0,attrs:{menu:e}})}),1)],1)],1)},s=[],i=n("cebc"),r=n("161e"),o=n("2f62"),l={name:"mainSideMenu",components:{SubMenu:r["default"]},data:function(){return{}},created:function(){},watch:{menuActiveIndex:function(e){null===e&&(this.$refs.menu.activeIndex=e)}},computed:Object(i["a"])({},Object(o["d"])(["menuData"]),Object(o["d"])("main",["menuKey","isCollapse","menuActiveIndex","sideMenuDarkSkin"])),methods:{selectMenuHandle:function(e){var t=this.findMenuItem(this.menuData,e);t&&this.$router.push(t.routerPath)},findMenuItem:function(e,t){for(var n=null,a=e.length;a--;){if(e[a].id===t){n=e[a];break}e[a].children&&e[a].children.length&&(n=this.findMenuItem(e[a].children,t))}return n}}},c=l,u=n("2877"),m=Object(u["a"])(c,a,s,!1,null,null,null);t["default"]=m.exports},e6b9:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("main",{staticClass:"main-content"},[n("div",{staticClass:"main-content-inner"},["tab"===e.$route.meta.openMode?[n("el-dropdown",{staticClass:"tabs-tools cursor-pr",attrs:{size:"medium",trigger:"click"},on:{command:e.handleCommand}},[n("span",{staticClass:"el-dropdown-link"},[n("svg-icon",{attrs:{icon:"menu"}})],1),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{attrs:{command:"now"}},[n("svg-icon",{attrs:{icon:"flag"}}),e._v(" "+e._s(e.$t("tabsHandle.closeCurrent"))+"\n          ")],1),n("el-dropdown-item",{attrs:{command:"other"}},[n("svg-icon",{attrs:{icon:"tag"}}),e._v(" "+e._s(e.$t("tabsHandle.closeOther"))+"\n          ")],1),n("el-dropdown-item",{attrs:{command:"all"}},[n("svg-icon",{attrs:{icon:"tags"}}),e._v(" "+e._s(e.$t("tabsHandle.closeAll"))+"\n          ")],1)],1)],1),n("el-tabs",{staticClass:"main-content-tabs",attrs:{value:e.tabActiveName},on:{"tab-click":e.tabSelectedHandle,"tab-remove":e.removeTab}},e._l(e.tabs,function(t){return n("el-tab-pane",{key:t.name,class:{"iframe-wrapper":t.isIframe},attrs:{name:t.name,closable:"sys_home"!==t.name}},[n("template",{slot:"label"},[t.icon?n("svg-icon",{attrs:{icon:t.icon}}):e._e(),e._v("\n            "+e._s("sys_home"!==t.name?t.label:"")+"\n          ")],1),t.isIframe?[n("iframe",{staticStyle:{border:"none"},attrs:{src:t.resourceUrl,width:"100%",height:"100%"}})]:[n("el-scrollbar",{staticClass:"b-r-small"},[t.name===e.tabActiveName?n("router-view",{key:e.tabRouterKey}):e._e()],1)]],2)}),1)]:"home"===e.$route.meta.openMode?[e.$route.meta.isIframe?[n("iframe",{staticStyle:{border:"none"},attrs:{src:e.$route.meta.resourceUrl,width:"100%",height:"100%"}})]:[n("el-scrollbar",{staticClass:"b-r-small"},[n("router-view",{key:e.tabRouterKey})],1)]]:e._e()],2)])},s=[],i=(n("7f7f"),n("cebc")),r=(n("cadf"),n("551c"),n("f751"),n("097d"),n("2f62")),o={name:"mainContent",data:function(){return{}},computed:Object(i["a"])({},Object(r["d"])("main",["tabs","tabActiveName","tabRouterKey","isCollapse"])),methods:Object(i["a"])({},Object(r["c"])("main",["updateTabs","setTabsActiveName"]),{handleCommand:function(e){"now"===e?this.removeTab(this.tabActiveName):"other"===e?this.removeOtherTabs():this.removeAllTabs()},tabSelectedHandle:function(e){e.name!==this.tabActiveName&&(e=this.tabs.filter(function(t){return t.name===e.name})[0],e&&this.$router.push({name:e.name,params:Object(i["a"])({},e.params),query:Object(i["a"])({},e.query)}))},removeTab:function(e){var t=null;if("sys_home"===e)return!1;var n=this.tabs.filter(function(n,a){return n.name===e&&(t=a),n.name!==e});this.updateTabs(n),t!==this.tabs.length-1&&(t-=1),this.$router.push({name:this.tabs[t].name,query:Object(i["a"])({},this.tabs[t].query),params:Object(i["a"])({},this.tabs[t].params)})},removeOtherTabs:function(){var e=this;this.updateTabs(this.tabs.filter(function(t){return"sys_home"===t.name||t.name===e.tabActiveName}))},removeAllTabs:function(){this.updateTabs(this.tabs.filter(function(e){return"sys_home"===e.name})),this.$router.push({name:"sys_home",query:Object(i["a"])({},this.tabs[0].query),params:Object(i["a"])({},this.tabs[0].params)})}})},l=o,c=n("2877"),u=Object(c["a"])(l,a,s,!1,null,null,null);t["default"]=u.exports}}]);
//# sourceMappingURL=main.57d1f6d2.js.map
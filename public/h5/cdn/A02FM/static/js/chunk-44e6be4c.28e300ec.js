(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-44e6be4c"],{"2c5c":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"page"},[n("Header",{scopedSlots:t._u([{key:"right",fn:function(){return[n("a",{staticClass:"header__button link",attrs:{href:"javascript:void (0);"}},[t._v("编辑")])]},proxy:!0}])}),n("div",{staticClass:"container"},[n("h3",[n("a",{attrs:{href:"javascript:void (0);"},on:{click:function(e){return t.$router.push("/page2")}}},[t._v("返回上一页")])]),n("p",[t._v("此页面没有页面权重（meta.index）所以不会有切换效果")]),n("p",[t._v("此页未缓存")]),n("p",[t._v("此页面需要登录后才允许进入")]),n("pre",[t._v("      meta: {\n        title: '第三页',\n        needLogin: true,\n        keepAlive: false\n      },\n      components: {\n        default: () => import('../views/page3.vue')\n      }\n  ")])])],1)},r=[],c=(n("ac1f"),n("5319"),n("0418")),o={name:"test",components:{Header:c["a"]},beforeRouteEnter:function(t,e,n){n((function(t){t.formPath=e.path}))},data:function(){return{formPath:null}},methods:{callback:function(){this.formPath&&"/"!==this.formPath?this.$router.back():this.$router.replace("/")}}},i=o,s=(n("38cf0"),n("2877")),u=Object(s["a"])(i,a,r,!1,null,"9314ee68",null);e["default"]=u.exports},"38cf0":function(t,e,n){"use strict";var a=n("b477"),r=n.n(a);r.a},b477:function(t,e,n){}}]);
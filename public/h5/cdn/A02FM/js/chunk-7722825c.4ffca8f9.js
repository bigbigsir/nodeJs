(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7722825c"],{"56b0":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"page"},[n("Header",{scopedSlots:t._u([{key:"left",fn:function(){return[n("button",{staticClass:"header__button header__button--back",on:{click:t.callback}},[t._v("返回")])]},proxy:!0},{key:"right",fn:function(){return[n("a",{staticClass:"header__button link",attrs:{href:"javascript:void (0);"}},[t._v("查看规则")])]},proxy:!0}])}),n("div",{staticClass:"container"},[n("h3",[n("a",{attrs:{href:"javascript:void (0);"},on:{click:function(e){return t.$router.push("/page3")}}},[t._v("下一页")])]),n("p",[t._v("此页未缓存")]),t._m(0),n("pre",[t._v("      meta: {\n        title: '第二页',\n        index: 3,\n        keepAlive: false\n      },\n      components: {\n        default: () => import('../views/page2.vue')\n      }\n  ")])])],1)},r=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[t._v(" 头部右侧按钮需要自定义，未使用公共头部，引入Header组件"),n("br"),t._v(" 返回按钮方法需要自定义，因为引入Header组件，进入该页面时， Header组件不会触发导航守卫（beforeRouteEnter）， formPath就始终为null，就不能在输入地址进入页面时正常的返回! ")])}],c=(n("ac1f"),n("5319"),n("0418")),o={name:"referralPartner",components:{Header:c["a"]},beforeRouteEnter:function(t,e,n){n((function(t){t.formPath=e.path}))},data:function(){return{formPath:null}},created:function(){},methods:{callback:function(){this.formPath&&"/"!==this.formPath?this.$router.back():this.$router.replace("/")}}},i=o,u=(n("9ead"),n("2877")),s=Object(u["a"])(i,a,r,!1,null,"0d321e33",null);e["default"]=s.exports},"5c70":function(t,e,n){},"9ead":function(t,e,n){"use strict";var a=n("5c70"),r=n.n(a);r.a}}]);
//# sourceMappingURL=chunk-7722825c.4ffca8f9.js.map
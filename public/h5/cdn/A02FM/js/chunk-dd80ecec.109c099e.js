(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dd80ecec"],{"289f":function(t,n,a){},5792:function(t,n,a){"use strict";var e=a("289f"),i=a.n(e);i.a},eb82:function(t,n,a){"use strict";a.r(n);var e=function(){var t=this,n=t.$createElement,a=t._self._c||n;return a("div",{staticClass:"mien container"},[a("nav",{staticClass:"mien__nav"},t._l(t.navs,(function(n,e){return a("a",{key:e,staticClass:"mien__nav-item",class:{active:n.path===t.$route.path},attrs:{href:"javascript:void (0);"},on:{click:function(a){return t.toggleTab(n,e)}}},[t._v(" "+t._s(n.name)+" ")])})),0),a("div",{staticClass:"mien__content"},[a("transition",{attrs:{name:t.transitionName},on:{afterLeave:function(n){t.transitionName=null}}},[a("router-view")],1)],1)])},i=[],s=(a("4160"),a("ac1f"),a("5319"),a("159b"),{name:"mien",data:function(){return{transitionName:null,navs:[{name:"开发赞助",path:"/mien/sponsor"},{name:"品牌历程",path:"/mien/history"},{name:"凯发微视",path:"/mien/videos"}]}},computed:{activeIndex:function(){var t=this,n=0;return this.navs.forEach((function(a,e){a.path===t.$route.path&&(n=e)})),n}},methods:{toggleTab:function(t,n){n>this.activeIndex?this.transitionName="slide-left":n<this.activeIndex&&(this.transitionName="slide-right"),this.$router.replace(t.path)}}}),r=s,c=(a("5792"),a("2877")),o=Object(c["a"])(r,e,i,!1,null,"3d5c4282",null);n["default"]=o.exports}}]);
//# sourceMappingURL=chunk-dd80ecec.109c099e.js.map
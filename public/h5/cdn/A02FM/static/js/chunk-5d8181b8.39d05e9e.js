(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5d8181b8"],{"4da3":function(t,a,e){"use strict";var i=e("d7ad"),n=e.n(i);n.a},"6c26":function(t,a){t.exports="https://img.60kg.top/h5/cdn/A02FM/static/img/loading.gif.9a1855f5.webp"},bc93:function(t,a,e){var i={"./loading.gif":"fc48","./loading.gif.webp":"6c26"};function n(t){var a=o(t);return e(a)}function o(t){if(!e.o(i,t)){var a=new Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}return i[t]}n.keys=function(){return Object.keys(i)},n.resolve=o,t.exports=n,n.id="bc93"},ce7b:function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"load-game page"},[i("div",{staticClass:"load-game__content"},[i("h2",{staticClass:"load-game__title border-bottom"},[t._v("温馨提示")]),i("p",{staticClass:"load-game__tips"},[t._v("您正在"+t._s(t.loginStatus?"":"使用试玩身份")+"进入")]),i("p",{staticClass:"load-game__tips"},[t._v(t._s(t.platformName[t.$route.query.gameCode]))]),i("img",{staticClass:"load-game__img",attrs:{src:e("bc93")("./loading.gif"+this.$useWebpImg()),alt:"Loading..."}})])])},n=[],o=e("5530"),s=e("5880"),c=e("06de"),r={name:"loadingGame",data:function(){return{platformName:c["c"]}},computed:Object(o["a"])({},Object(s["mapGetters"])(["loginStatus"])),activated:function(){var t=this,a=setTimeout((function(){t.$toast.error({message:"进入游戏错误，请稍后再试",callback:function(){window.close()}}),clearTimeout(a)}),5e3)}},d=r,l=(e("4da3"),e("2877")),u=Object(l["a"])(d,i,n,!1,null,"2e8298f4",null);a["default"]=u.exports},d7ad:function(t,a,e){},fc48:function(t,a){t.exports="https://img.60kg.top/h5/cdn/A02FM/static/img/loading.9a1855f5.gif"}}]);
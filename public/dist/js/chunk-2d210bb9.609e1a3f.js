(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d210bb9"],{b8c0:function(e,t,n){"use strict";n.r(t);var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-dropdown",{attrs:{trigger:"click",size:"medium",placement:"bottom"},on:{command:e.handleLangSelect}},[n("span",{staticClass:"trigger"},[e._t("default")],2),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},e._l(e.messages,function(t,s){return n("el-dropdown-item",{key:s,attrs:{disabled:s===e.$i18n.locale,command:s}},[e._v("\n      "+e._s(t._lang)+"\n    ")])}),1)],1)},a=[],o=(n("cadf"),n("551c"),n("f751"),n("097d"),n("a47e")),l={name:"LanguageSelect",data:function(){return{messages:o["messages"]}},methods:{handleLangSelect:function(e){this.$i18n.locale=e,this.$message({type:"success",message:this.$t("prompt.success"),duration:1e3}),localStorage.setItem("language",e)}}},c=l,d=n("2877"),r=Object(d["a"])(c,s,a,!1,null,null,null);t["default"]=r.exports}}]);
//# sourceMappingURL=chunk-2d210bb9.609e1a3f.js.map
"use strict";(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-0ac0c861"],{"2a65":function(t,i,a){a.r(i);var e=(a("99af"),a("4de4"),a("d81d"),a("9911"),a("c32d")),n=a.n(e),o={name:"promotions",data:function(){return{promoList:[]}},created:function(){this.getPromoList()},methods:{getPromoList:function(){var o=this;this.$api.getWmsStatic("/_promo/promo_list_new.txt").then(function(t){var i,a=t.data,e=[],n=Date.now();Array.isArray(a)&&(e=a=(a=a.filter(function(t){return"1"===t.retain1&&(t.time_begin===t.time_end?0==+t.time_begin:1e3*t.time_end>n)})).map(function(t){return i={title:t.title,label:t.label,link:t.link?"/h5".concat(t.link):null,is_blank:1==+t.is_blank,pic:"".concat(window.dynamicConfig.wmsServer,"/").concat(t.pic)},0==+t.time_begin?i.date="永久有效":i.date="".concat(o.formatDate(t.time_begin)," - ").concat(o.formatDate(t.time_end)),i})),o.promoList=e})},formatDate:function(t){return n()(1e3*t).format("YYYY年MM月DD日")}}},s=(a("e1eb"),a("2877")),r=Object(s.a)(o,function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"promotions container"},[a.promoList.length?a._l(a.promoList,function(t,i){return e("div",{key:i,staticClass:"promotions__item"},[e("a",{staticClass:"promotions__img-wrapper default-bg-small",attrs:{href:t.link,target:t.is_blank?"_blank":"_self"}},[e("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.pic,expression:"item.pic"}],staticClass:"promotions__img",attrs:{alt:t.title}})]),e("p",{staticClass:"promotions__title"},[a._v(a._s(t.title))]),e("p",{staticClass:"promotions__sub-title"},[a._v(a._s(t.label))]),e("p",{staticClass:"promotions__date"},[a._v(a._s(t.date))])])}):a._l(3,function(t){return e("div",{key:t,staticClass:"promotions__item"},[e("a",{staticClass:"promotions__img-wrapper default-bg-small"}),e("p",{staticClass:"promotions__title"},[a._v("--")]),e("p",{staticClass:"promotions__sub-title"},[a._v("--")]),e("p",{staticClass:"promotions__date"},[a._v("-")])])})],2)},[],!1,null,"301ad7ee",null);i.default=r.exports},e1eb:function(t,i,a){var e=a("f9ea");a.n(e).a},f9ea:function(){}}]);